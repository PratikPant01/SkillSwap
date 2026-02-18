import express from "express";
const router = express.Router();

// Create a comment for a post
router.post("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { comment, rating } = req.body; // <-- frontend sends `comment`
  const userId = req.user.id;
  const pool = req.app.locals.pool;

  try {
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content, rating)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [postId, userId, comment, rating] // <-- map frontend comment to content
    );

    res.json({ success: true, comment: result.rows[0] });
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ success: false, message: "Failed to create comment" });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const pool = req.app.locals.pool;

    // Fetch all comments for the post
    const commentsRes = await pool.query(
      `SELECT c.id, c.content, c.rating, c.created_at, u.id as user_id, u.username
       FROM comments c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [postId]
    );

    // Fetch stats: total comments and average rating
    const statsRes = await pool.query(
      `SELECT COUNT(*)::int as total_comments, COALESCE(ROUND(AVG(comments.rating),1),0)::float AS average_rating
       FROM comments
       WHERE post_id = $1`,
      [postId]
    );

    res.json({
      success: true,
      comments: commentsRes.rows,
      commentStats: statsRes.rows[0], // key must be exactly 'commentStats'
    });
  } catch (err) {
    console.error("Fetch comments error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch comments" });
  }
});


export default router;
