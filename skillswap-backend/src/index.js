import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import multer from "multer";
import path from "path";


dotenv.config();
const { Pool } = pkg;
const app = express();
//so basically for talking with the backend
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DB_URL,
});
//request the data from the server
app.get("/", (req, res) => {
  res.send("SkillSwap Backend is running with Database Connection");
});
//sends the data to the server 

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //hash the password
    const hashedpassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email,username,password) VALUES ($1,$2,$3) RETURNING id, email, username",
      [email, username, hashedpassword],
    );
    //except the password chai pathauxa cuz its returning the id email and username
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Registration error: ", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

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
    //jwt token to sotre the session info 
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Login error: ", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});


// Authenticiation token for Creating Posts
const authenticateToken = (req,res,next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
    if(err) return res.sendStatus(403);
    req.user = user; // attaches user info
    next();
  });
};

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
// Post Api Route
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
      const images = req.files.map(file => file.path); // Save file paths in DB

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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log`Server running on port ${PORT}`);
app.listen(PORT ,()=> console.log `baka` )