import dotenv from "dotenv";
import express from "express";
//pg libraray to interact with postgres database
import pkg from "pg";
import columnsRouter from "./routes/columnsRoute.js";
import tagsRouter from "./routes/tagsRoute.js";
import logsRouter from "./routes/logsRoute.js";
import cardsRouter from "./routes/cardsRoute.js";
import cors from "cors";
const { Pool } = pkg;

// Load environment variables from .env file
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// Enable CORS for all domains or specifically for your frontend domain
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from the frontend (localhost:3000)
  methods: "GET,POST,PUT,DELETE", // Allow specific methods if needed
  allowedHeaders: "Content-Type, Authorization", // Allow specific headers
}));

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
// app.get("/", async (req, res) => {
//   res.send("Hello World!");
// });

app.use(express.json());

//middleware to parse url-encoded data (usually used in forms);
app.use(express.urlencoded({extended:true}))

app.use('/api', columnsRouter);
app.use('/api', tagsRouter);
app.use('/api', logsRouter);
app.use('/api', cardsRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
