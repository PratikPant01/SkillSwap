
import express from "express";
const router = express.Router();

// Get current user's profile
router.get("/me", async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = req.app.locals.pool;

        // Fetch basic profile info
        const profileResult = await pool.query(
            `SELECT p.*, u.username, u.email, u.first_name, u.last_name
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1`,
            [userId]
        );

        let profile = profileResult.rows[0];

        if (!profile) {
            // If profile doesn't exist, return basic user info
            const userResult = await pool.query(
                "SELECT id, username, email, first_name, last_name FROM users WHERE id = $1",
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

        res.json({
            ...profile,
            education: eduResult.rows,
            languages: langResult.rows,
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

export default router;
