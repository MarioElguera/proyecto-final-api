const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB en Atlas.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        // Si falla la conexión, termina la aplicación
        process.exit(1);
    }
};

module.exports = connectDB;
