import express from "express";
import { query } from "../server.js";
const columnsRouter = express.Router();

// Get all columns
columnsRouter.get("/columns", async (req, res) => {
  try {
    const result = await query("SELECT * FROM columns");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a new column
columnsRouter.post("/columns", async (req, res) => {
  try {
    const { name } = req.body; // Extract the name from the request body
    if (!name) {
      return res.status(400).json({ error: "Column name is required" });
    }
    const result = await query(
      "INSERT INTO columns (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]); // Return the newly created column
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default columnsRouter;
