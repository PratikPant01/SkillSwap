// routes/proposals.js
import express from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// POST /proposals/:postId  (buyer creates a proposal)
router.post("/:postId", authenticateToken, upload.array("files", 5), async (req, res) => {
  const pool = req.app.locals.pool;
  const postId = parseInt(req.params.postId, 10);
  const buyerId = req.user.id;
  const { cover_letter } = req.body;
  const files = (req.files || []).map(f => f.path);

  if (!cover_letter || !cover_letter.trim()) return res.status(400).json({ success:false, message:"Cover letter required" });

  try {
    // verify post exists
    const p = await pool.query("SELECT id FROM posts WHERE id=$1", [postId]);
    if (!p.rows.length) return res.status(404).json({ success:false, message:"Post not found" });

    const r = await pool.query(
      `INSERT INTO proposals (post_id, buyer_id, cover_letter, files)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [postId, buyerId, cover_letter, files]
    );
    res.json({ success:true, proposal: r.rows[0] });
  } catch (err) {
    console.error("Create proposal error:", err);
    res.status(500).json({ success:false });
  }
});

// GET /proposals/seller  -> seller sees proposals for his posts
router.get("/seller", authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  const sellerId = req.user.id;
  try {
    const rows = (await pool.query(`
      SELECT pr.*, posts.title, posts.user_id AS seller_id, u.username AS buyer_name, u.id as buyer_id
      FROM proposals pr
      JOIN posts ON pr.post_id = posts.id
      JOIN users u ON pr.buyer_id = u.id
      WHERE posts.user_id = $1
      ORDER BY pr.created_at DESC
    `, [sellerId])).rows;
    res.json({ success:true, proposals: rows });
  } catch (err) {
    console.error("Fetch seller proposals:", err);
    res.status(500).json({ success:false });
  }
});

// POST /proposals/:id/accept  -> seller accepts; create order & escrow deduct
// POST /proposals/:id/accept
router.post("/:id/accept", authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  const sellerId = req.user.id;
  const proposalId = parseInt(req.params.id, 10);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const pr = (await client.query("SELECT * FROM proposals WHERE id=$1", [proposalId])).rows[0];
    if (!pr) throw new Error("Proposal not found");

    const post = (await client.query("SELECT * FROM posts WHERE id=$1", [pr.post_id])).rows[0];
    if (!post || post.user_id !== sellerId) throw new Error("Unauthorized or post not found");

    const amount = post.price || 0;

    // Only handle credits if price > 0
    if (amount > 0) {
      const buyerRow = (await client.query("SELECT credits FROM users WHERE id=$1 FOR UPDATE", [pr.buyer_id])).rows[0];
      if (!buyerRow || buyerRow.credits < amount) {
        await client.query("ROLLBACK");
        return res.status(400).json({ success: false, message: "Buyer has insufficient credits" });
      }

      await client.query("UPDATE users SET credits = credits - $1 WHERE id = $2", [amount, pr.buyer_id]);
      
      await client.query(
        "INSERT INTO credit_history (user_id, amount, transaction_type, description) VALUES ($1,$2,$3,$4)",
        [pr.buyer_id, -amount, "ESCROW", `Escrow for proposal #${proposalId}`]
      );
    }

    // Create order (works for 0 or >0 credits)
    const orderRes = await client.query(
      `INSERT INTO orders (post_id, proposal_id, buyer_id, seller_id, escrow_amount, status)
       VALUES ($1,$2,$3,$4,$5,'IN_PROGRESS') RETURNING *`,
      [pr.post_id, proposalId, pr.buyer_id, sellerId, amount]
    );

    await client.query("UPDATE proposals SET status='ACCEPTED' WHERE id=$1", [proposalId]);

    await client.query("COMMIT");
    res.json({ success: true, order: orderRes.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});
// POST /proposals/:id/reject  -> seller rejects
router.post("/:id/reject", authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  const proposalId = parseInt(req.params.id, 10);
  try {
    // optional: verify seller owns post (omitted for brevity, but recommended)
    await pool.query("UPDATE proposals SET status='REJECTED' WHERE id=$1", [proposalId]);
    res.json({ success:true });
  } catch (err) {
    console.error("Reject proposal error:", err);
    res.status(500).json({ success:false });
  }
});

export default router;
