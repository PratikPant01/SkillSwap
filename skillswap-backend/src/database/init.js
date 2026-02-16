import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

async function initDatabase() {
    let client;
    try {
        console.log("Connecting to database...");
        
        // Test connection first
        client = await pool.connect();
        console.log("Database connection successful!");
        
        console.log("Reading schema file...");
        const schemaPath = path.join(__dirname, 'schema.sql');
        
        // Check if schema file exists
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at: ${schemaPath}`);
        }
        
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        console.log(" Schema file loaded");

        console.log(" Executing schema...");
        await client.query(schema);
        console.log(" Database tables created successfully!");
        
        // Verify tables were created
        console.log("\n Verifying tables...");
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        console.log("\nTables in database:");
        tablesResult.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });
        
        console.log("\n Database initialization complete!");
        
    } catch (err) {
        console.error(" Database initialization error:");
        console.error(err.message);
        console.error("\nFull error:", err);
        process.exit(1);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

initDatabase();