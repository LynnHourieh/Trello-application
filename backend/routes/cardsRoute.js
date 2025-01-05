import express from "express";
import { query } from "../server.js";
const cardsRouter = express.Router();


//get all cards 
cardsRouter.get("/cards", async (req, res) => {
  try {
    // Get all cards ordered by position
    const result = await query(
      "SELECT * FROM cards ORDER BY position"
    );

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
  
      // Case 1: Moving the card to a different column
      if (currentColumnId !== targetColumnId) {
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
          // sourceColumnCards: allCardsInSourceColumn.rows,
          // targetColumnCards: allCardsInTargetColumn.rows,
        });
      }
  
      // Case 2: Moving within the same column
      else if(currentColumnId === targetColumnId) {
        // Step 1: Validate new position within the valid range
        const maxPositionResult = await query(
          "SELECT MAX(position) AS max_position FROM cards WHERE column_id = $1",
          [currentColumnId]
        );
        const maxPosition = maxPositionResult.rows[0].max_position;
  
        if (newPosition < 1 || newPosition > maxPosition) {
          return res.status(400).json({
            error: "New position is out of bounds for the current column.",
          });
        }
  
        // Step 2: Reorder the cards in the current column (shift the positions that are affected)
        if (newPosition > currentPosition) {
          // Moving down the column
          await query(
            "UPDATE cards SET position = position - 1 WHERE column_id = $1 AND position > $2 AND position <= $3",
            [currentColumnId, currentPosition, newPosition]
          );
        } else if (newPosition < currentPosition) {
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
  
        // Fetch all cards for the column, sorted by position
        const allCardsInColumn = await query(
          "SELECT * FROM cards WHERE column_id = $1 ORDER BY position",
          [currentColumnId]
        );
  
        // Return the updated list of cards in the column
        return res.status(200).json({
          message: "Card position updated successfully within the same column",
          cards: allCardsInColumn.rows,
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  

export default cardsRouter;
