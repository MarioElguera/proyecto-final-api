const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', err.message);

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Ocurrió un error inesperado. Intenta nuevamente.'
            : err.message
    });
};

module.exports = { errorHandler };
