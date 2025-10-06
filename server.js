import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Connect to Render Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://hlopg_user:bRUV9nYRhtNh0No4b7ANp342lcPvGId6@dpg-d3hkr4e3jp1c73fkgurg-a.oregon-postgres.render.com/hlopg",
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

// Simple API
app.get("/api/hi", (req, res) => {
  res.json({ message: "Hi from Render backend 🚀" });
});

// Create table API
app.get("/api/create-table", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        email VARCHAR(100)
      );
    `);
    res.json({ message: "✅ Table 'users' created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create table" });
  }
});

// Add user
app.post("/api/add-user", async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
    res.json({ message: "✅ User added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// View users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
