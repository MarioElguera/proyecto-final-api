const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const err = new Error('Username and password are required');
            err.status = 400;
            return next(err);
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const err = new Error('Username is already in use');
            err.status = 409;
            return next(err);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role: 'user' // default role
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

// Login user
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const err = new Error('Username and password are required');
            err.status = 400;
            return next(err);
        }

        const user = await User.findOne({ username });
        if (!user) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };
