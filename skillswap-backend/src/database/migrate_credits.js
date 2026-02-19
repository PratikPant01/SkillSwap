import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pkg;
const pool = new Pool({
    connectionString: process.env.DB_URL,
});

async function migrate() {
    try {
        console.log("Starting migration...");
        const client = await pool.connect();

        // Add last_login_at to users
        console.log("Checking users table for last_login_at column...");
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_login_at') THEN
                    ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
                END IF;
            END $$;
        `);
        console.log("✅ last_login_at column ensured.");

        // Create credit_history table
        console.log("Creating credit_history table if it doesn't exist...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS credit_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount INTEGER NOT NULL,
                transaction_type TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ credit_history table ensured.");

        client.release();
        console.log("🚀 Migration complete!");
    } catch (err) {
        console.error("❌ Migration failed:", err.message);
    } finally {
        await pool.end();
    }
}

migrate();
