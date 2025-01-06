import express from "express";
import { query } from "../server.js";
const cardsRouter = express.Router();

//get all cards
cardsRouter.get("/cards", async (req, res) => {
  try {
    // Get all cards ordered by position
    const result = await query("SELECT * FROM cards ORDER BY position");

    res.json(result.rows); // Send the result as a JSON response
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a new card
cardsRouter.post("/cards", async (req, res) => {
  try {
    const { title, description, tag_id, column_id } = req.body;

    // Validate input: Ensure column_id is provided
    if (!title || !description || !tag_id || !column_id) {
      return res.status(400).json({
        error: "All fields are required: title, description, tag_id, column_id",
      });
    }

    // Get the current highest position in the specified column
    const positionResult = await query(
      "SELECT MAX(position) AS max_position FROM cards WHERE column_id = $1",
      [column_id]
    );

    // Determine the position for the new card (one more than the current highest position)
    const newPosition = positionResult.rows[0].max_position
      ? positionResult.rows[0].max_position + 1
      : 1;

    // Insert the new card with the calculated position
    const result = await query(
      "INSERT INTO cards (title, description, tag_id, column_id, position) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, tag_id, column_id, newPosition]
    );

    // Respond with the newly created card
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

cardsRouter.put("/cards/:id/position", async (req, res) => {
  try {
    const { id } = req.params; // The ID of the card whose position is being changed
    const { newPosition, targetColumnId } = req.body; // The new position and the target column_id to move the card to

    if (newPosition === undefined || targetColumnId === undefined) {
      return res.status(400).json({
        error: "New position and targetColumnId is required.",
      });
    }

    // Get the current card details
    const cardResult = await query("SELECT * FROM cards WHERE id = $1", [id]);
    const card = cardResult.rows[0];

    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    const currentColumnId = card.column_id;
    const currentPosition = card.position;

    let movedToNewColumn = false;
    let movedDirection = null; // "up" or "down"

    // Case 1: Moving the card to a different column
    if (currentColumnId !== targetColumnId) {
      movedToNewColumn = true;
      // Step 1: Update column_id for the card in the target column
      await query("UPDATE cards SET column_id = $1 WHERE id = $2", [
        targetColumnId,
        id,
      ]);

      // Step 2: Reorder the cards in the target column
      // Shift the positions of cards in the target column that are at or after the new position
      await query(
        "UPDATE cards SET position = position + 1 WHERE column_id = $1 AND position >= $2",
        [targetColumnId, newPosition]
      );

      // Step 3: Update the position of the card in the new column
      await query("UPDATE cards SET position = $1 WHERE id = $2", [
        newPosition,
        id,
      ]);

      // Step 4: Reorder the cards in the source column (shift the positions down to close the gap)
      await query(
        "UPDATE cards SET position = position - 1 WHERE column_id = $1 AND position > $2",
        [currentColumnId, currentPosition]
      );

      // Step 5: Reorder positions for all cards in the target column to ensure sequential order
      await query(
        "WITH ordered AS (SELECT id, ROW_NUMBER() OVER (ORDER BY position) AS rownum FROM cards WHERE column_id = $1) UPDATE cards SET position = ordered.rownum FROM ordered WHERE cards.id = ordered.id",
        [targetColumnId]
      );

      // Step 6: Reorder positions for all cards in the source column to ensure sequential order
      await query(
        "WITH ordered AS (SELECT id, ROW_NUMBER() OVER (ORDER BY position) AS rownum FROM cards WHERE column_id = $1) UPDATE cards SET position = ordered.rownum FROM ordered WHERE cards.id = ordered.id",
        [currentColumnId]
      );

      // Fetch all cards in both columns, sorted by position
      const allCardsInSourceColumn = await query(
        "SELECT * FROM cards WHERE column_id = $1 ORDER BY position",
        [currentColumnId]
      );

      const allCardsInTargetColumn = await query(
        "SELECT * FROM cards WHERE column_id = $1 ORDER BY position",
        [targetColumnId]
      );

      // Return the updated lists of cards in both columns
      return res.status(200).json({
        message: "Card moved to new column and position updated successfully",
        cards: [...allCardsInSourceColumn.rows, ...allCardsInTargetColumn.rows],
        movedToNewColumn,
        movedDirection: null, // Not applicable
      });
    }

    // Case 2: Moving within the same column
    else if (currentColumnId === targetColumnId) {
      movedToNewColumn = false;
      // Step 1: Validate new position within the valid range
      const maxPositionResult = await query(
        "SELECT MAX(position) AS max_position FROM cards WHERE column_id = $1",
        [currentColumnId]
      );
      const maxPosition = maxPositionResult.rows[0].max_position;
      if (newPosition < 1) {
        return res.status(400).json({
          error: "New position is out of bounds for the current column.",
        });
      }

      if (newPosition > maxPosition) {
        movedDirection = "down";

        // Moving down the column
        await query(
          "UPDATE cards SET position = position - 1 WHERE column_id = $1 AND position > $2 AND position <= $3",
          [currentColumnId, currentPosition, maxPosition]
        );
      }

      // Step 2: Reorder the cards in the current column (shift the positions that are affected)
      if (newPosition > currentPosition) {
        movedDirection = "down";
        // Moving down the column
        await query(
          "UPDATE cards SET position = position - 1 WHERE column_id = $1 AND position > $2 AND position <= $3",
          [currentColumnId, currentPosition, newPosition]
        );
      } else if (newPosition < currentPosition) {
        movedDirection = "up";
        // Moving up the column
        await query(
          "UPDATE cards SET position = position + 1 WHERE column_id = $1 AND position < $2 AND position >= $3",
          [currentColumnId, currentPosition, newPosition]
        );
      }

      // Step 3: Update the position of the card in the same column
      await query("UPDATE cards SET position = $1 WHERE id = $2", [
        newPosition,
        id,
      ]);

      // Step 4: Reorder positions for all cards in the column to ensure sequential order
      await query(
        "WITH ordered AS (SELECT id, ROW_NUMBER() OVER (ORDER BY position) AS rownum FROM cards WHERE column_id = $1) UPDATE cards SET position = ordered.rownum FROM ordered WHERE cards.id = ordered.id",
        [currentColumnId]
      );

      // Fetch all cards for the column, sorted by position
      const allCardsInColumn = await query(
        "SELECT * FROM cards WHERE column_id = $1 ORDER BY position",
        [currentColumnId]
      );

      // Return the updated list of cards in the column
      return res.status(200).json({
        message: "Card position updated successfully within the same column",
        cards: allCardsInColumn.rows,
        movedToNewColumn,
        movedDirection,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update an existing card
cardsRouter.put("/cards/:id", async (req, res) => {
  try {
    const { id } = req.params; // Card ID from the URL
    const { title, description, tag_id } = req.body;

    // Validate input: At least one field to update must be provided
    if (!title && !description && !tag_id) {
      return res.status(400).json({
        error: "At least one field (title, description, tag_id) must be provided for update",
      });
    }

    // Build the SQL query dynamically based on the fields provided
    const fieldsToUpdate = [];
    const values = [];
    let queryIndex = 1;

    if (title) {
      fieldsToUpdate.push(`title = $${queryIndex++}`);
      values.push(title);
    }
    if (description) {
      fieldsToUpdate.push(`description = $${queryIndex++}`);
      values.push(description);
    }
    if (tag_id) {
      fieldsToUpdate.push(`tag_id = $${queryIndex++}`);
      values.push(tag_id);
    }

    // Add the card ID to the values array
    values.push(id);

    // If no fields are specified, return a validation error
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({
        error: "No fields to update",
      });
    }

    // Construct the SQL query
    const queryText = `
      UPDATE cards
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = $${queryIndex}
      RETURNING *;
    `;

    // Execute the query
    const result = await query(queryText, values);

    // If no card was updated, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Respond with the updated card
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


export default cardsRouter;
