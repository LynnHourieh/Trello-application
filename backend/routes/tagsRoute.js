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
    const { name, bg_color, font_color } = req.body;

    if (!name || !bg_color || !font_color) {
      return res.status(400).json({ error: "Name and color are required" });
    }

    const result = await query(
      "INSERT INTO tags (name, bg_color, font_color) VALUES ($1, $2, $3) RETURNING *",
      [name, bg_color, font_color]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // Unique constraint violation
      res.status(409).json({ error: "Tag name must be unique" });
    } else {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
});

// Update a tag by id
tagsRouter.put("/tags/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bg_color, font_color } = req.body;
  
    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (bg_color) {
      fields.push(`bg_color = $${index++}`);
      values.push(bg_color);
    }
    if (font_color) {
      fields.push(`font_color = $${index++}`);
      values.push(font_color);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);
    const queryText = `UPDATE tags SET ${fields.join(
      ", "
    )} WHERE id = $${index} RETURNING *`;

    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default tagsRouter;
