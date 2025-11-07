import logger from "../utils/logger.js";
/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input) {
    if (typeof input !== "string")
        return "";
    return input
        .replace(/[<>]/g, "") // Remove < and >
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+=/gi, "") // Remove event handlers
        .trim();
}
/**
 * Validate and sanitize task creation input
 */
export function validateTaskInput(req, res, next) {
    try {
        const { type, title, reward, target, description } = req.body;
        // Validate type
        if (!type || !["channel", "bot"].includes(type)) {
            res.status(400).json({
                error: "BadRequest",
                message: "Invalid task type. Must be 'channel' or 'bot'",
                statusCode: 400,
            });
            return;
        }
        // Validate title
        if (!title || typeof title !== "string" || title.length < 3) {
            res.status(400).json({
                error: "BadRequest",
                message: "Title must be at least 3 characters",
                statusCode: 400,
            });
            return;
        }
        if (title.length > 255) {
            res.status(400).json({
                error: "BadRequest",
                message: "Title must be less than 255 characters",
                statusCode: 400,
            });
            return;
        }
        // Validate reward
        if (!reward || typeof reward !== "number" || reward <= 0) {
            res.status(400).json({
                error: "BadRequest",
                message: "Reward must be a positive number",
                statusCode: 400,
            });
            return;
        }
        if (reward > 10000) {
            res.status(400).json({
                error: "BadRequest",
                message: "Reward cannot exceed 10000 stars",
                statusCode: 400,
            });
            return;
        }
        // Validate target
        if (!target || typeof target !== "string" || target.length < 1) {
            res.status(400).json({
                error: "BadRequest",
                message: "Target is required",
                statusCode: 400,
            });
            return;
        }
        // Sanitize inputs
        req.body.title = sanitizeString(title);
        req.body.target = sanitizeString(target);
        if (description) {
            if (typeof description !== "string") {
                res.status(400).json({
                    error: "BadRequest",
                    message: "Description must be a string",
                    statusCode: 400,
                });
                return;
            }
            req.body.description = sanitizeString(description);
        }
        next();
    }
    catch (error) {
        logger.error("Error validating task input", { error });
        res.status(400).json({
            error: "BadRequest",
            message: "Invalid input data",
            statusCode: 400,
        });
    }
}
/**
 * Validate withdrawal amount
 */
export function validateWithdrawalInput(req, res, next) {
    try {
        const { amount } = req.body;
        if (!amount || typeof amount !== "number") {
            res.status(400).json({
                error: "BadRequest",
                message: "Amount must be a number",
                statusCode: 400,
            });
            return;
        }
        if (amount < 100) {
            res.status(400).json({
                error: "BadRequest",
                message: "Minimum withdrawal amount is 100 stars",
                statusCode: 400,
            });
            return;
        }
        if (amount > 1000000) {
            res.status(400).json({
                error: "BadRequest",
                message: "Amount exceeds maximum limit",
                statusCode: 400,
            });
            return;
        }
        if (!Number.isInteger(amount)) {
            res.status(400).json({
                error: "BadRequest",
                message: "Amount must be a whole number",
                statusCode: 400,
            });
            return;
        }
        next();
    }
    catch (error) {
        logger.error("Error validating withdrawal input", { error });
        res.status(400).json({
            error: "BadRequest",
            message: "Invalid input data",
            statusCode: 400,
        });
    }
}
/**
 * Validate banner input
 */
export function validateBannerInput(req, res, next) {
    try {
        const { imageUrl, link, orderIndex } = req.body;
        // Validate imageUrl
        if (!imageUrl || typeof imageUrl !== "string") {
            res.status(400).json({
                error: "BadRequest",
                message: "Image URL is required",
                statusCode: 400,
            });
            return;
        }
        // Basic URL validation
        try {
            new URL(imageUrl);
        }
        catch {
            res.status(400).json({
                error: "BadRequest",
                message: "Invalid image URL format",
                statusCode: 400,
            });
            return;
        }
        // Validate link
        if (!link || typeof link !== "string") {
            res.status(400).json({
                error: "BadRequest",
                message: "Link is required",
                statusCode: 400,
            });
            return;
        }
        try {
            new URL(link);
        }
        catch {
            res.status(400).json({
                error: "BadRequest",
                message: "Invalid link URL format",
                statusCode: 400,
            });
            return;
        }
        // Validate orderIndex if provided
        if (orderIndex !== undefined) {
            if (typeof orderIndex !== "number" || orderIndex < 0) {
                res.status(400).json({
                    error: "BadRequest",
                    message: "Order index must be a non-negative number",
                    statusCode: 400,
                });
                return;
            }
        }
        next();
    }
    catch (error) {
        logger.error("Error validating banner input", { error });
        res.status(400).json({
            error: "BadRequest",
            message: "Invalid input data",
            statusCode: 400,
        });
    }
}
/**
 * Validate task ID parameter
 */
export function validateTaskId(req, res, next) {
    try {
        const taskId = parseInt(req.params.id);
        if (isNaN(taskId) || taskId <= 0) {
            res.status(400).json({
                error: "BadRequest",
                message: "Invalid task ID",
                statusCode: 400,
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(400).json({
            error: "BadRequest",
            message: "Invalid task ID",
            statusCode: 400,
        });
    }
}
/**
 * Validate withdrawal ID parameter
 */
export function validateWithdrawalId(req, res, next) {
    try {
        const withdrawalId = parseInt(req.params.id);
        if (isNaN(withdrawalId) || withdrawalId <= 0) {
            res.status(400).json({
                error: "BadRequest",
                message: "Invalid withdrawal ID",
                statusCode: 400,
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(400).json({
            error: "BadRequest",
            message: "Invalid withdrawal ID",
            statusCode: 400,
        });
    }
}
//# sourceMappingURL=validation.js.map