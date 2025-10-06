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

app.get("/api/create-hostel-table", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hostels (
        hostel_id SERIAL PRIMARY KEY,
        hostel_name VARCHAR(100) NOT NULL,
        area VARCHAR(100),
        city VARCHAR(100),
        rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
        amenities JSONB DEFAULT '{}',
        price DECIMAL(10,2) NOT NULL,
        owner_id INT REFERENCES owners(owner_id) ON DELETE CASCADE
      );
    `);
    res.json({ message: "✅ Table 'hostels' created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create hostels table" });
  }
});

app.get("/api/add-user-get", async (req, res) => {
  const { name, email } = req.query;
  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }
  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
    res.json({ message: `✅ User ${name} added via GET` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add user" });
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
