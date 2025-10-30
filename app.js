// app.js
const express = require("express");
const cors = require("cors"); // 1. Import modul CORS
const app = express();

// routes
const userRoutes = require("./routes/userRoutes");
const wajibRetribusiRoutes = require("./routes/wajibRetribusiRoutes");
const revenueRoutes = require("./routes/revenueRoutes");

// 2. Konfigurasi dan Gunakan CORS Middleware
// Kami mengasumsikan frontend Anda berjalan di port 5173.
// Jika frontend Anda berjalan di port atau domain lain, ganti nilai 'origin' di bawah.
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// prefix API
app.use("/api/auth", userRoutes);
app.use("/api/wajib-retribusi", wajibRetribusiRoutes);

// ini bikin endpoint: GET /api/revenue?year=2025
app.use("/api", revenueRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// kalau mau di-import di tempat lain
module.exports = app;
