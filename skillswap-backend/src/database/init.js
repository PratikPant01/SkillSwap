import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const {Pool}= pkg;
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const pool=new Pool({
    connectionString:process.env.DB_URL,
})

async function initDatabase() {
    try{
        console.log("Initializing database.");
        const schemaPath= path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        await pool.query(schema);
        console.log("Database started successfully.");
    }
    catch(err){
        console.error("Database initialization error: ", err);
    }
    finally
    {
        await pool.end();
    }
}
initDatabase();
