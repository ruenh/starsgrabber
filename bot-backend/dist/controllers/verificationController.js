import { VerificationService } from "../services/verificationService.js";
import { BotActivationService } from "../services/botActivationService.js";
import logger from "../utils/logger.js";
/**
 * Verify channel subscription
 * POST /verify/channel
 */
export async function verifyChannelSubscription(req, res) {
    try {
        const { userId, channelUsername } = req.body;
        if (!userId || !channelUsername) {
            res.status(400).json({
                error: "BadRequest",
                message: "Missing userId or channelUsername",
                verified: false,
            });
            return;
        }
        const isSubscribed = await VerificationService.checkChannelSubscription(userId, channelUsername);
        res.status(200).json({
            verified: isSubscribed,
            userId,
            channelUsername,
        });
    }
    catch (error) {
        logger.error("Error in verifyChannelSubscription", { error });
        res.status(500).json({
            error: "ServerError",
            message: "Failed to verify subscription",
            verified: false,
        });
    }
}
/**
 * Verify bot activation
 * POST /verify/bot
 */
export async function verifyBotActivation(req, res) {
    try {
        const { userId, taskId } = req.body;
        if (!userId || !taskId) {
            res.status(400).json({
                error: "BadRequest",
                message: "Missing userId or taskId",
                verified: false,
            });
            return;
        }
        // Check if bot activation exists using service
        const verified = await BotActivationService.checkActivation(userId, taskId);
        res.status(200).json({
            verified,
            userId,
            taskId,
        });
    }
    catch (error) {
        logger.error("Error in verifyBotActivation", { error });
        res.status(500).json({
            error: "ServerError",
            message: "Failed to verify bot activation",
            verified: false,
        });
    }
}
//# sourceMappingURL=verificationController.js.map