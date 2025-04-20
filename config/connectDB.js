const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ Conexión exitosa a MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Error de conexión a MongoDB:', error.message);
        process.exit(1); // Detiene la app si no se conecta
    }
};

module.exports = connectDB;
