import { Withdrawal, Task } from "../types/index.js";
/**
 * Validate withdrawal request
 * Requirements: 7.1, 7.2, 7.3
 */
export declare function validateWithdrawalRequest(userId: number, amount: number): Promise<{
    valid: boolean;
    error?: string;
}>;
/**
 * Get user's completed channel subscription tasks
 * Requirement 7.6: Verify all completed channel subscriptions are still active
 */
export declare function getUserCompletedChannelTasks(userId: number): Promise<Task[]>;
/**
 * Verify channel subscriptions are still active
 * Requirements: 7.6, 7.7
 */
export declare function verifyActiveSubscriptions(userId: number): Promise<{
    allActive: boolean;
    inactiveTasks: Task[];
}>;
/**
 * Deduct stars for inactive subscriptions
 * Requirement 7.7: If any channel subscription is inactive, deduct Stars for that Task
 * Uses database transaction to ensure atomicity
 */
export declare function deductStarsForInactiveSubscriptions(userId: number, inactiveTasks: Task[]): Promise<number>;
/**
 * Create withdrawal request
 * Requirements: 7.8, 7.9
 */
export declare function createWithdrawalRequest(userId: number, amount: number): Promise<Withdrawal>;
/**
 * Get user withdrawals
 * Requirement 8.1, 8.2, 8.3, 8.4, 8.5
 */
export declare function getUserWithdrawals(userId: number): Promise<Withdrawal[]>;
/**
 * Get withdrawal by ID
 */
export declare function getWithdrawalById(withdrawalId: number): Promise<Withdrawal | null>;
/**
 * Update withdrawal status
 */
export declare function updateWithdrawalStatus(withdrawalId: number, status: "approved" | "rejected", rejectionReason?: string): Promise<Withdrawal>;
//# sourceMappingURL=withdrawalService.d.ts.map