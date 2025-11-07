export declare class VerificationService {
    /**
     * Check if user is subscribed to a channel
     */
    static checkChannelSubscription(userId: number, channelUsername: string): Promise<boolean>;
    /**
     * Check if user has activated bot for a specific task
     */
    static checkBotActivation(userId: number, taskId: number): Promise<boolean>;
}
//# sourceMappingURL=verificationService.d.ts.map