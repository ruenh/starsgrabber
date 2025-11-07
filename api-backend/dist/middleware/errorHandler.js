import logger from "../utils/logger.js";
export const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    logger.error(`Error: ${message}`, {
        statusCode,
        path: req.path,
        method: req.method,
        stack: err.stack,
    });
    res.status(statusCode).json({
        error: err.name || "Error",
        message,
        statusCode,
    });
};
//# sourceMappingURL=errorHandler.js.map