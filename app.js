const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const wajibRetribusiRoutes = require('./routes/wajibRetribusiRoutes');

app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/wajib-retribusi', wajibRetribusiRoutes);

const PORT = 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));