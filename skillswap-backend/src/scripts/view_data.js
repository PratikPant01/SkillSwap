
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env relative to this script location: src/scripts/view_data.js -> ../../.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

async function viewData() {
    try {
        console.log("--- Users ---");
        const users = await pool.query("SELECT * FROM users");
        console.table(users.rows);

        console.log("\n--- Profiles ---");
        const profiles = await pool.query("SELECT * FROM profiles");
        console.table(profiles.rows);

        console.log("\n--- Skills ---");
        const skills = await pool.query("SELECT * FROM skills");
        console.table(skills.rows);

    } catch (err) {
        console.error("Error fetching data:", err);
    } finally {
        await pool.end();
    }
}

viewData();
