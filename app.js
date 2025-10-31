const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const wajibRetribusiRoutes = require('./routes/wajibRetribusiRoutes');
const jenisRoutes = require('./routes/jenisRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');

app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/wajib-retribusi', wajibRetribusiRoutes);
app.use('/api/jenis-retribusi', jenisRoutes);
app.use('/api/kategori-retribusi', kategoriRoutes);

const PORT = 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));