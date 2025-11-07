/**
 * Service for sending notifications via Bot Backend
 */
export declare class NotificationService {
    private static sendRequest;
    /**
     * Notify all users about a new task
     * Requirement 14.1: WHEN new Task is created, THE Bot Backend SHALL send notification message to all Users
     */
    static notifyNewTask(taskTitle: string, reward: number, taskType: string): Promise<boolean>;
    /**
     * Notify user about referral completion
     * Requirement 14.2: WHEN Referral completes Task, THE Bot Backend SHALL send notification to referrer User
     */
    static notifyReferralCompletion(userId: number, referralName: string, earnings: number, taskTitle: string): Promise<boolean>;
    /**
     * Notify user about withdrawal approval
     * Requirement 14.3: WHEN Withdrawal Request is approved, THE Bot Backend SHALL send notification to User
     */
    static notifyWithdrawalApproved(userId: number, amount: number): Promise<boolean>;
    /**
     * Notify user about withdrawal rejection
     * Requirement 14.4: WHEN Withdrawal Request is rejected, THE Bot Backend SHALL send notification to User with reason
     */
    static notifyWithdrawalRejected(userId: number, amount: number, reason: string): Promise<boolean>;
    /**
     * Notify admin about new withdrawal request
     * Requirement 14.5: WHEN Withdrawal Request is created, THE Bot Backend SHALL send notification to Admin
     */
    static notifyAdminWithdrawalRequest(username: string, amount: number, userId: number, withdrawalId: number): Promise<boolean>;
}
//# sourceMappingURL=notificationService.d.ts.map