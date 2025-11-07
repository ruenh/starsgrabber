import { bot } from "../index.js";
import logger from "../utils/logger.js";
export class VerificationService {
    /**
     * Check if user is subscribed to a channel
     */
    static async checkChannelSubscription(userId, channelUsername) {
        try {
            // Add @ if not present
            const channel = channelUsername.startsWith("@")
                ? channelUsername
                : `@${channelUsername}`;
            const member = await bot.api.getChatMember(channel, userId);
            const isSubscribed = ["member", "administrator", "creator"].includes(member.status);
            logger.info(`Subscription check for user ${userId} in ${channel}: ${isSubscribed ? "subscribed" : "not subscribed"}`);
            return isSubscribed;
        }
        catch (error) {
            logger.error(`Error checking subscription for user ${userId} in ${channelUsername}:`, error);
            return false;
        }
    }
    /**
     * Check if user has activated bot for a specific task
     */
    static async checkBotActivation(userId, taskId) {
        // This will be checked via database in the API backend
        // This is just a placeholder for the service structure
        logger.info(`Bot activation check for user ${userId}, task ${taskId}`);
        return false;
    }
}
//# sourceMappingURL=verificationService.js.map