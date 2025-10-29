const jwt = require('jsonwebtoken');
const SECRET_KEY = '1223';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token tidak ada' });

    try {
        const decode = jwt.verify(token, SECRET_KEY);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }
};