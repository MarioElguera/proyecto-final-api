const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar usuario
const registerUser = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            const err = new Error('El nombre de usuario y la contraseña son obligatorios');
            err.status = 400;
            return next(err);
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const err = new Error('El nombre de usuario ya está en uso');
            err.status = 409;
            return next(err);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role: role || 'user',
        });

        await user.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        next(error);
    }
};

// Iniciar sesión
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const err = new Error('El nombre de usuario y la contraseña son obligatorios');
            err.status = 400;
            return next(err);
        }

        const user = await User.findOne({ username });
        if (!user) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            return next(err);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            return next(err);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.status(200).json({ token, username: user.username });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };
