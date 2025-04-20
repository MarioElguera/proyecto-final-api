
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');
const eventRoutes = require('./routes/eventRoutes');

const { errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./config/connectDB');

dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Rutas
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API! 🌟');
});
app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/comments', commentRoutes);
app.use('/events', eventRoutes);

app.use(errorHandler);

// Conexión a la base de datos
connectDB();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
