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
      "INSERT INTO users (email, username, password, first_name, last_name) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, username, first_name, last_name",
      [email, username, hashedpassword, first_name, last_name]
    );
    // Returns the id, email and username (not password)
    res.json({ success: true, user: result.rows[0] });
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

    // JWT token to store the session info
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, username: user.username , credits: user.credits ?? 50, },
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

      const result = await pool.query(
        `INSERT INTO posts 
        (user_id, title, category, description, post_type, price,
          delivery_time, revisions, location, tags, images)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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

      res.json({ success: true, post: result.rows[0] });
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

