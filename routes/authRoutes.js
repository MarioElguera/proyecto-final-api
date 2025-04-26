const express = require('express');

// Controladores de 'authentication'
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Rutas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
