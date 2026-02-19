import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import multer from "multer";
import path from "path";
import messageRoutes from "./message.js";
import commentRoutes from "./comment.js";
import { awardCredits } from "./utils/credits.js";

dotenv.config();
const { Pool } = pkg;
const app = express();

// CORS for talking with the backend
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));


const pool = new Pool({
  connectionString: process.env.DB_URL,
});

// Make pool available to routes
app.locals.pool = pool;

// Request the data from the server
app.get("/", (req, res) => {
  res.send("SkillSwap Backend is running with Database Connection");
});

// Register endpoint
app.post("/register", async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;

  try {
    // Hash the password
    const hashedpassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, username, password, first_name, last_name, credits) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, username, first_name, last_name, credits",
      [email, username, hashedpassword, first_name, last_name, 50]
    );

    const newUser = result.rows[0];

    // Log initial credits to history
    await pool.query(
      "INSERT INTO credit_history (user_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4)",
      [newUser.id, 50, 'BONUS', 'Welcome Bonus']
    );

    // Returns the id, email, username and credits (not password)
    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error("Registration error: ", err);
    res.status(500).json({ success: false, message: "Registration failed or User already exists" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Daily Login Bonus Logic
    const lastLogin = user.last_login_at;
    const now = new Date();
    const isNewDay = !lastLogin || new Date(lastLogin).toDateString() !== now.toDateString();

    if (isNewDay) {
      await awardCredits(pool, user.id, 2, 'BONUS', 'Daily login bonus');
      await pool.query("UPDATE users SET last_login_at = $1 WHERE id = $2", [now, user.id]);
    }

    // JWT token to store the session info
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Fetch updated credits after bonus
    const updatedUser = isNewDay
      ? (await pool.query("SELECT credits FROM users WHERE id = $1", [user.id])).rows[0]
      : user;

    res.json({
      success: true,
      message: isNewDay ? "Login successful + 2 Daily Bonus!" : "Login successful",
      token,
      user: { id: user.id, email: user.email, username: user.username, credits: updatedUser.credits },
    });
  } catch (err) {
    console.error("Login error: ", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});


// Authentication token middleware for Creating Posts

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // attaches user info
    next();
  });
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp-originalname
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Post API Route
app.post(
  "/posts",
  authenticateToken,
  upload.array("images", 4), // handles up to 4 images
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        post_type,
        price,
        deliveryTime,
        revisions,
        location,
        tags,
      } = req.body;

      const userId = req.user.id;

      // Files from multer
      const images = req.files.map((file) => file.path); // Save file paths in DB

      const tagsArray = Array.isArray(tags) ? tags : tags ? [tags] : [];

      // Check credit balance
      const userRes = await pool.query("SELECT credits FROM users WHERE id = $1", [userId]);
      const userCredits = userRes.rows[0]?.credits || 0;

      if (userCredits < 10) {
        return res.status(403).json({ success: false, message: "Insufficient credits. You need 10 credits to post." });
      }

      // Start transaction
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // 1. Deduct cost for posting
        await awardCredits(client, userId, -10, 'SPENT', 'Service posting fee');

        // 2. Award bonus for sharing a skill
        await awardCredits(client, userId, 5, 'BONUS', 'Sharing a skill bonus');

        const result = await client.query(
          `INSERT INTO posts 
        (user_id, title, category, description, post_type, price,
          delivery_time, revisions, location, tags, images, status)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, 'OPEN')
          RETURNING *`,
          [
            userId,
            title,
            category,
            description,
            post_type,
            price || null,
            deliveryTime,
            revisions || null,
            location,
            tagsArray,
            images,
          ]
        );

        await client.query("COMMIT");
        res.json({
          success: true,
          message: "Post created! -10 credits fee +5 bonus earned.",
          post: result.rows[0]
        });
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);
      console.log("USER:", req.user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }
);

//Api endpoint for the create post page to fetch the posts from the database and display it on the frontend
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        posts.*,
        users.username,
        COALESCE(ROUND(AVG(comments.rating),1),0)::float AS average_rating,
        COUNT(comments.id)::int AS total_comments
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN comments ON comments.post_id = posts.id
      GROUP BY posts.id, users.username
      ORDER BY posts.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ success: false });
  }
});


// Get a single post by ID
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT posts.*, users.username 
       FROM posts 
       JOIN users ON posts.user_id = users.id 
       WHERE posts.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(result.rows[0]); // Return only the single object
  } catch (err) {
    console.error("Fetch single post error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Assign a user to a post
app.post("/posts/:id/assign", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if post exists and is OPEN
    const postRes = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (postRes.rows.length === 0) return res.status(404).json({ message: "Post not found" });

    const post = postRes.rows[0];
    if (post.status !== "OPEN") return res.status(400).json({ message: "Post is not available" });
    if (post.user_id === userId) return res.status(400).json({ message: "Cannot assign yourself to your own post" });

    // Assign user
    const result = await pool.query(
      "UPDATE posts SET assigned_to = $1, status = 'IN_PROGRESS' WHERE id = $2 RETURNING *",
      [userId, id]
    );

    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error("Assign post error:", err);
    res.status(500).json({ success: false });
  }
});

// Complete a post and reward credits
app.post("/posts/:id/complete", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const postRes = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (postRes.rows.length === 0) return res.status(404).json({ message: "Post not found" });

    const post = postRes.rows[0];
    if (post.user_id !== userId) return res.status(403).json({ message: "Only the owner can complete the post" });
    if (post.status !== "IN_PROGRESS") return res.status(400).json({ message: "Post must be in progress to complete" });
    if (!post.assigned_to) return res.status(400).json({ message: "No user assigned to this post" });

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update post status
      await client.query("UPDATE posts SET status = 'COMPLETED' WHERE id = $1", [id]);

      // Reward credits to assigned user
      await awardCredits(client, post.assigned_to, 50, 'EARNED', `Completed service: ${post.title}`);

      await client.query("COMMIT");
      res.json({ success: true, message: "Post completed and 50 credits awarded!" });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Complete post error:", err);
    res.status(500).json({ success: false });
  }
});

// Get credit history
app.get("/credits/history", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "SELECT id, amount, transaction_type, description, created_at FROM credit_history WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json({ success: true, history: result.rows });
  } catch (err) {
    console.error("Fetch credit history error:", err);
    res.status(500).json({ success: false });
  }
});

// Add credits (for testing/purchasing)
app.post("/credits/add", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body; // e.g., 50, 100

  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  try {
    const result = await pool.query(
      "UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING credits",
      [amount, userId]
    );
    res.json({ success: true, credits: result.rows[0].credits });
  } catch (err) {
    console.error("Add credits error:", err);
    res.status(500).json({ success: false });
  }
});

// Get all skills
app.get("/skills", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM skills ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error("Get skills error:", err);
    res.status(500).json({ success: false });
  }
});

// Add a new system skill
app.post("/skills", async (req, res) => {
  const { name, icon_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO skills (name, icon_url) VALUES ($1, $2) RETURNING *",
      [name, icon_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Add skill error:", err);
    res.status(500).json({ success: false });
  }
});

// Get current user's skills
app.get("/user-skills", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT us.id AS user_skill_id, us.type, us.proficiency, s.id AS skill_id, s.name, s.icon_url
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1
       ORDER BY us.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get user skills error:", err);
    res.status(500).json({ success: false });
  }
});

// Add a skill to current user
app.post("/user-skills", authenticateToken, async (req, res) => {
  const { skill_id, type, proficiency } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO user_skills (user_id, skill_id, type, proficiency)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, skill_id, type, proficiency || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Add user skill error:", err);
    res.status(500).json({ success: false });
  }
});

// Delete a skill from current user
app.delete("/user-skills/:id", authenticateToken, async (req, res) => {
  const userSkillId = req.params.id;
  try {
    await pool.query("DELETE FROM user_skills WHERE id=$1 AND user_id=$2", [
      userSkillId,
      req.user.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete user skill error:", err);
    res.status(500).json({ success: false });
  }
});


// Profile routes
import profileRoutes from "./routes/profile.js";
app.use("/profile", authenticateToken, profileRoutes);

// Message routes (with authentication)
app.use("/", authenticateToken, messageRoutes);

// Comment routes
app.use("/comments", authenticateToken, commentRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

