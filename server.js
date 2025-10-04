import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simple API for both React & Kotlin frontend
app.get("/api/hi", (req, res) => {
  res.json({ message: "Hi from Render backend 🚀" });
});

// Render gives PORT dynamically
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
