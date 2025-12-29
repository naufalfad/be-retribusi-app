// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const wajibRetribusiRoutes = require('./routes/wajibRetribusiRoutes');
const jenisRoutes = require('./routes/jenisRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const revenueRoutes = require("./routes/revenueRoutes");
const skrdRoutes = require("./routes/skrdRoutes");
const midtransNotificationRoutes = require("./routes/midtransNotificationRoutes");

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/wajib-retribusi', wajibRetribusiRoutes);
app.use('/api/jenis-retribusi', jenisRoutes);
app.use('/api/kategori-retribusi', kategoriRoutes);
// prefix API
app.use("/api/wajib-retribusi", wajibRetribusiRoutes);
// ini bikin endpoint: GET /api/revenue?year=2025
app.use("/api", revenueRoutes);
app.use('/api/skrd', skrdRoutes);
app.use('/api/midtrans', midtransNotificationRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// kalau mau di-import di tempat lain
module.exports = app;
