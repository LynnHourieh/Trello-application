import express from "express";
import { query } from "../server.js";
const logsRouter = express.Router();

// Get all logs order by date
logsRouter.get("/logs", async (req, res) => {
    try {
      const result = await query("SELECT * FROM logs ORDER BY timestamp DESC");
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

// Add a new log
logsRouter.post("/logs", async (req, res) => {
    try {
      const { description } = req.body;
  
      // Validate input
      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }
  
      // Insert log into the database with current timestamp
      const result = await query(
        "INSERT INTO logs (description, timestamp) VALUES ($1, NOW()) RETURNING *",
        [description]
      );
  
      // Respond with the newly created log
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  
  

export default logsRouter;
