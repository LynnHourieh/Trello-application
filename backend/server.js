import dotenv from "dotenv";
import express from "express";
//pg libraray to interact with postgres database
import pkg from "pg";
const { Pool } = pkg;

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.port || 8000;

// Set up PostgreSQL connection using the Pool (connection pooling)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Export the query method for querying the database
export const query = (text, params) => pool.query(text, params);

// Test the database connection
pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.stack);
  });

// Example API route to interact with the database
app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
