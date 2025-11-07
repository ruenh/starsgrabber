export declare class BotActivationService {
    /**
     * Record bot activation in database
     * @param userId - User ID
     * @param taskId - Task ID
     * @returns Success status
     */
    static recordActivation(userId: number, taskId: number): Promise<boolean>;
    /**
     * Check if bot activation exists
     * @param userId - User ID
     * @param taskId - Task ID
     * @returns True if activation exists
     */
    static checkActivation(userId: number, taskId: number): Promise<boolean>;
    /**
     * Generate bot activation link
     * @param botUsername - Bot username
     * @param userId - User ID
     * @param taskId - Task ID
     * @returns Bot activation link
     */
    static generateActivationLink(botUsername: string, userId: number, taskId: number): string;
}
//# sourceMappingURL=botActivationService.d.ts.map