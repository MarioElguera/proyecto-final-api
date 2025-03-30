const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Acceso Denegado');

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();

    } catch (error) {
        res.status(400).send('Token inválido');
    }
};

module.exports = authMiddleware;
