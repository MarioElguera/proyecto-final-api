const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        // Solo mostrar detalles extra en desarrollo
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    });
};

module.exports = { errorHandler };
