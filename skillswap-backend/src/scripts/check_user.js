import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DB_URL });

async function check() {
    try {
        const email = 'janak@gmail.com';
        const userRes = await pool.query("SELECT id, credits FROM users WHERE email = $1", [email]);
        if (userRes.rows.length === 0) {
            console.log("User not found");
            return;
        }
        const user = userRes.rows[0];
        console.log(`User: ${email}, ID: ${user.id}, Credits: ${user.credits}`);

        const historyRes = await pool.query("SELECT * FROM credit_history WHERE user_id = $1 ORDER BY created_at DESC", [user.id]);
        console.log("\n--- Credit History ---");
        console.log(JSON.stringify(historyRes.rows, null, 2));

        const postsRes = await pool.query("SELECT id, title, status, assigned_to, created_at FROM posts WHERE user_id = $1", [user.id]);
        console.log("\n--- User Posts ---");
        console.log(JSON.stringify(postsRes.rows, null, 2));

        const assignedPostsRes = await pool.query("SELECT id, title, status, user_id, created_at FROM posts WHERE assigned_to = $1", [user.id]);
        console.log("\n--- Posts Assigned to User ---");
        console.log(JSON.stringify(assignedPostsRes.rows, null, 2));

        const commentsRes = await pool.query("SELECT c.rating, c.content, p.title FROM comments c JOIN posts p ON c.post_id = p.id WHERE p.user_id = $1", [user.id]);
        console.log("\n--- Ratings Received ---");
        console.log(JSON.stringify(commentsRes.rows, null, 2));

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}
check();
