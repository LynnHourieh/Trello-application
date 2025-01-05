import express from "express";
import { query } from "../server.js";
const tagsRouter = express.Router();

// Get all tags
tagsRouter.get("/tags", async (req, res) => {
  try {
    const result = await query("SELECT * FROM tags");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a new tag
tagsRouter.post("/tags", async (req, res) => {
    try {
      const { name, color } = req.body;
  
      if (!name || !color) {
        return res.status(400).json({ error: "Name and color are required" });
      }
  
      const result = await query(
        "INSERT INTO tags (name, color) VALUES ($1, $2) RETURNING *",
        [name, color]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') { // Unique constraint violation
        res.status(409).json({ error: "Tag name must be unique" });
      } else {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  });
  

export default tagsRouter;
