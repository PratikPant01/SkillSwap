import express from "express";

const router = express.Router();

// Get or create the conversation between the two users
router.post("/conversations", async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.user.id;
    const pool = req.app.locals.pool;

    const existingConv = await pool.query(
      `SELECT c.id, c.created_at, c.updated_at
       FROM conversations c
       INNER JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
       INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
       WHERE cp1.user_id = $1 AND cp2.user_id = $2`,
      [currentUserId, otherUserId]
    );

    if (existingConv.rows.length > 0) {
      return res.json({ success: true, conversation: existingConv.rows[0] });
    }

    const newConv = await pool.query(
      "INSERT INTO conversations DEFAULT VALUES RETURNING *"
    );
    const conversationId = newConv.rows[0].id;

    await pool.query(
      "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)",
      [conversationId, currentUserId, otherUserId]
    );

    res.json({ success: true, conversation: newConv.rows[0] });
  } catch (err) {
    console.error("Create conversation error:", err);
    res.status(500).json({ success: false, message: "Failed to create conversation" });
  }
});

// Get all conversations for the current user
router.get("/conversations", async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    const conversations = await pool.query(
      `SELECT 
        c.id,
        c.created_at,
        c.updated_at,
        u.id as other_user_id,
        u.username as other_user_name,
        u.email as other_user_email,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.sender_id != $1 
         AND m.created_at > cp.last_read_at) as unread_count
       FROM conversations c
       INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
       INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
       INNER JOIN users u ON cp2.user_id = u.id
       WHERE cp.user_id = $1 AND cp2.user_id != $1
       ORDER BY c.updated_at DESC`,
      [userId]
    );

    res.json({ success: true, conversations: conversations.rows });
  } catch (err) {
    console.error("Fetch conversations error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
});
//loads the chat message
router.get("/conversations/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    const participant = await pool.query(
      "SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, userId]
    );

    if (participant.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const messages = await pool.query(
      `SELECT m.*, u.username as sender_name
       FROM messages m
       INNER JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [conversationId]
    );

    // Update last_read_at for this user
    await pool.query(
      "UPDATE conversation_participants SET last_read_at = NOW() WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, userId]
    );

    res.json({ success: true, messages: messages.rows });
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});
//sends message
router.post("/conversations/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;
    const pool = req.app.locals.pool;

    // Verify user is participant
    const participant = await pool.query(
      "SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, senderId]
    );

    if (participant.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Insert message
    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING *, (SELECT username FROM users WHERE id = $2) as sender_name`,
      [conversationId, senderId, content]
    );

    res.json({ success: true, message: result.rows[0] });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

// Get user info for starting a conversation (search users)
router.get("/users/search", async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.id;
    const pool = req.app.locals.pool;

    const users = await pool.query(
      `SELECT id, username, email 
       FROM users 
       WHERE (username ILIKE $1 OR email ILIKE $1) 
       AND id != $2
       LIMIT 10`,
      [`%${query}%`, currentUserId]
    );

    res.json({ success: true, users: users.rows });
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ success: false, message: "Failed to search users" });
  }
});

export default router;