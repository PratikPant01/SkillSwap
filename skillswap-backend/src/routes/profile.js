
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer storage configuration for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });


// Get current user's profile
router.get("/me", async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = req.app.locals.pool;

        // Fetch basic profile info
        const profileResult = await pool.query(
            `SELECT p.*, u.username, u.email, u.first_name, u.last_name, u.credits, u.created_at
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1`,
            [userId]
        );

        let profile = profileResult.rows[0];

        if (!profile) {
            // If profile doesn't exist, return basic user info
            const userResult = await pool.query(
                "SELECT id, username, email, first_name, last_name, credits, created_at FROM users WHERE id = $1",
                [userId]
            );
            const user = userResult.rows[0];
            if (!user) return res.status(404).json({ message: "User not found" });

            profile = {
                user_id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                credits: user.credits,
                created_at: user.created_at,
                headline: "",
                bio: "",
                location: "",
                profile_picture_url: null,
                portfolio_url: "",
                linkedin_url: "",
                github_url: ""
            };
        }

        // Fetch education
        const eduResult = await pool.query(
            "SELECT * FROM user_education WHERE user_id = $1 ORDER BY start_year DESC",
            [userId]
        );

        // Fetch languages
        const langResult = await pool.query(
            "SELECT * FROM user_languages WHERE user_id = $1",
            [userId]
        );

        // Fetch portfolio projects
        const portfolioResult = await pool.query(
            "SELECT * FROM portfolio_projects WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        // Fetch completed services (posts assigned to user that are COMPLETED)
        const servicesResult = await pool.query(
            `SELECT p.*, u.username as owner_username 
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.assigned_to = $1 AND p.status = 'COMPLETED'
             ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json({
            ...profile,
            education: eduResult.rows,
            languages: langResult.rows,
            portfolio: portfolioResult.rows,
            completed_services: servicesResult.rows,
        });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update profile
router.put("/me", async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = req.app.locals.pool;
        const {
            headline,
            bio,
            location,
            profile_picture_url,
            portfolio_url,
            linkedin_url,
            github_url,
            education, // Array of education objects
            languages, // Array of language objects
        } = req.body;

        // Upsert profile
        await pool.query(
            `INSERT INTO profiles (user_id, headline, bio, location, profile_picture_url, portfolio_url, linkedin_url, github_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         headline = EXCLUDED.headline,
         bio = EXCLUDED.bio,
         location = EXCLUDED.location,
         profile_picture_url = EXCLUDED.profile_picture_url,
         portfolio_url = EXCLUDED.portfolio_url,
         linkedin_url = EXCLUDED.linkedin_url,
         github_url = EXCLUDED.github_url,
         updated_at = NOW()`,
            [
                userId,
                headline,
                bio,
                location,
                profile_picture_url,
                portfolio_url,
                linkedin_url,
                github_url,
            ]
        );

        // Update Education (Delete all and re-insert for simplicity, or careful update)
        // Strategy: Delete all for user and re-insert
        if (education && Array.isArray(education)) {
            await pool.query("DELETE FROM user_education WHERE user_id = $1", [userId]);
            for (const edu of education) {
                await pool.query(
                    "INSERT INTO user_education (user_id, institution, degree, start_year, end_year) VALUES ($1, $2, $3, $4, $5)",
                    [userId, edu.institution, edu.degree, edu.start_year, edu.end_year]
                );
            }
        }

        // Update Languages
        if (languages && Array.isArray(languages)) {
            await pool.query("DELETE FROM user_languages WHERE user_id = $1", [userId]);
            for (const lang of languages) {
                await pool.query(
                    "INSERT INTO user_languages (user_id, language, level) VALUES ($1, $2, $3)",
                    [userId, lang.language, lang.level]
                );
            }
        }

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Get public profile by username
router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const pool = req.app.locals.pool;

        // Find user first
        const userResult = await pool.query("SELECT id, username, email FROM users WHERE username = $1", [username]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = userResult.rows[0];

        // Fetch profile
        const profileResult = await pool.query(
            "SELECT * FROM profiles WHERE user_id = $1",
            [user.id]
        );
        const profile = profileResult.rows[0] || {};

        // Fetch education
        const eduResult = await pool.query(
            "SELECT * FROM user_education WHERE user_id = $1 ORDER BY start_year DESC",
            [user.id]
        );

        // Fetch languages
        const langResult = await pool.query(
            "SELECT * FROM user_languages WHERE user_id = $1",
            [user.id]
        );

        // Fetch skills (publicly visible)
        const skillsResult = await pool.query(
            `SELECT us.type, us.proficiency, s.name, s.icon_url
             FROM user_skills us
             JOIN skills s ON us.skill_id = s.id
             WHERE us.user_id = $1`,
            [user.id]
        );


        res.json({
            user: { username: user.username, email: user.email }, // Be careful exposing email publicly
            ...profile,
            education: eduResult.rows,
            languages: langResult.rows,
            skills: skillsResult.rows
        });

    } catch (err) {
        console.error("Get public profile error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// --- Portfolio Endpoints ---

// Upload portfolio project image
router.post("/portfolio/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path.replace(/\\/g, "/"); // Normalize path for web
        const imageUrl = `http://localhost:5000/${filePath}`;

        res.json({ success: true, imageUrl });
    } catch (err) {
        console.error("Portfolio image upload error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Add portfolio project
router.post("/portfolio", async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = req.app.locals.pool;
        const { title, description, image_url, project_url } = req.body;

        const result = await pool.query(
            `INSERT INTO portfolio_projects (user_id, title, description, image_url, project_url)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, title, description, image_url, project_url]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Add portfolio error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update portfolio project
router.put("/portfolio/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const pool = req.app.locals.pool;
        const { title, description, image_url, project_url } = req.body;

        const result = await pool.query(
            `UPDATE portfolio_projects 
             SET title = $1, description = $2, image_url = $3, project_url = $4
             WHERE id = $5 AND user_id = $6 RETURNING *`,
            [title, description, image_url, project_url, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Portfolio project not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Update portfolio error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Delete portfolio project
router.delete("/portfolio/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const pool = req.app.locals.pool;

        await pool.query(
            "DELETE FROM portfolio_projects WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Delete portfolio error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// --- Photo Upload ---

router.post("/upload-photo", upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const userId = req.user.id;
        const pool = req.app.locals.pool;
        const filePath = req.file.path.replace(/\\/g, "/"); // Normalize path for web
        const photoUrl = `http://localhost:5000/${filePath}`;

        // Update profile with new photo URL
        await pool.query(
            `INSERT INTO profiles (user_id, profile_picture_url, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET profile_picture_url = EXCLUDED.profile_picture_url, updated_at = NOW()`,
            [userId, photoUrl]
        );

        res.json({ success: true, photoUrl });
    } catch (err) {
        console.error("Upload photo error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;

