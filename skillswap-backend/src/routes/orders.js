// routes/orders.js
import express from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// POST /orders/:id/deliver  (seller uploads deliverables)
// POST /orders/:id/deliver (seller uploads deliverables)
router.post("/:id/deliver", authenticateToken, upload.array("files", 10), async (req, res) => {
  const pool = req.app.locals.pool;
  const orderId = parseInt(req.params.id, 10);
  const sellerId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Lock the order and check status
    const order = (await client.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE", [orderId])).rows[0];
    
    if (!order) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Security check
    if (order.seller_id !== sellerId) {
      await client.query("ROLLBACK");
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    // Prevent upload if the order is already finalized
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Order is already closed" });
    }

    const paths = (req.files || []).map(f => f.path);
    
    // Append new files to the existing array and keep/set status to 'DELIVERED'
    await client.query(
      `UPDATE orders 
       SET seller_delivered_files = COALESCE(seller_delivered_files, ARRAY[]::text[]) || $1, 
           status='DELIVERED', 
           updated_at=NOW()
       WHERE id=$2`, 
      [paths, orderId]
    );

    await client.query("COMMIT");
    res.json({ success: true, message: "Files uploaded successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Deliver error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

// POST /orders/:id/confirm  (buyer or seller confirms)
// POST /orders/:id/confirm
router.post("/:id/confirm", authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  const orderId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const order = (await client.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE", [orderId])).rows[0];
    
    if (!order) { await client.query("ROLLBACK"); return res.status(404).json({ success:false }); }

    // Update confirmation based on who clicked
    if (userId === order.buyer_id) {
      await client.query("UPDATE orders SET buyer_confirmed = TRUE WHERE id=$1", [orderId]);
    } else if (userId === order.seller_id) {
      await client.query("UPDATE orders SET seller_confirmed = TRUE WHERE id=$1", [orderId]);
    }

    const updated = (await client.query("SELECT * FROM orders WHERE id=$1", [orderId])).rows[0];

    // Check if we can complete (Usually, buyer confirming is enough to trigger payout)
    if (updated.buyer_confirmed && updated.status !== 'COMPLETED') {
      const bonus = 50; 
      const totalPayout = updated.escrow_amount + bonus;

      // 1. Pay the seller (Escrow + 50 Credit Reward)
      await client.query("UPDATE users SET credits = credits + $1 WHERE id = $2", [totalPayout, updated.seller_id]);
      
      // 2. Log it in history
      await client.query(
        "INSERT INTO credit_history (user_id, amount, transaction_type, description) VALUES ($1,$2,$3,$4)",
        [updated.seller_id, totalPayout, 'EARNED', `Order #${orderId} payout + bonus`]
      );

      // 3. Mark Order and Post as finished
      await client.query("UPDATE orders SET status='COMPLETED', updated_at=NOW() WHERE id=$1", [orderId]);
      await client.query("UPDATE posts SET status='COMPLETED' WHERE id=$1", [updated.post_id]);
    }

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

// GET /orders  -> returns orders for current user (buyer OR seller)
router.get("/", authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  const uid = req.user.id;
  try {
    const rows = (await pool.query(`
      SELECT o.*, p.title as post_title
      FROM orders o
      JOIN posts p ON o.post_id = p.id
      WHERE o.buyer_id = $1 OR o.seller_id = $1
      ORDER BY o.created_at DESC
    `, [uid])).rows;
    res.json({ success:true, orders: rows });
  } catch (err) {
    console.error("Get orders:", err);
    res.status(500).json({ success:false });
  }
});

export default router;
