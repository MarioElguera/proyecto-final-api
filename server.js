const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');

// Rutas
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Middlewares
const { errorHandler } = require('./middlewares/errorMiddleware');

// Configuraciones iniciales
dotenv.config();
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares generales
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rutas
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API!');
});
app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/comments', commentRoutes);
app.use('/events', eventRoutes);

// Middleware de manejo de errores
app.use(errorHandler);
module.exports = app;
