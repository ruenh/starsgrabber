/**
 * Controller for handling notification requests
 * These methods can be called from the API backend
 */
export declare class NotificationController {
    /**
     * Handle new task notification
     */
    static handleNewTaskNotification(data: {
        taskTitle: string;
        reward: number;
        taskType: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle referral completion notification
     */
    static handleReferralCompletionNotification(data: {
        userId: number;
        referralName: string;
        earnings: number;
        taskTitle: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle withdrawal approval notification
     */
    static handleWithdrawalApprovalNotification(data: {
        userId: number;
        amount: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle withdrawal rejection notification
     */
    static handleWithdrawalRejectionNotification(data: {
        userId: number;
        amount: number;
        reason: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Handle admin withdrawal request notification
     */
    static handleAdminWithdrawalRequestNotification(data: {
        username: string;
        amount: number;
        userId: number;
        withdrawalId: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=notificationController.d.ts.map