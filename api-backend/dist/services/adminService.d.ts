import { Task, Withdrawal, User } from "../types/index.js";
/**
 * Admin Task Management
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7
 */
/**
 * Create a new task
 * Requirement 10.4: Create Task record and set status to active
 */
export declare function createTask(taskData: {
    type: "channel" | "bot";
    title: string;
    description?: string;
    reward: number;
    target: string;
    avatar_url?: string;
}): Promise<Task>;
/**
 * Update an existing task
 * Requirement 10.5: Update Task record with new values
 */
export declare function updateTask(taskId: number, taskData: {
    type?: "channel" | "bot";
    title?: string;
    description?: string;
    reward?: number;
    target?: string;
    avatar_url?: string;
}): Promise<Task>;
/**
 * Close a task (set status to inactive)
 * Requirement 10.6: Set Task status to inactive
 */
export declare function closeTask(taskId: number): Promise<Task>;
/**
 * Get all tasks (including inactive)
 * Requirement 10.1: Display list of all Tasks with status
 */
export declare function getAllTasks(): Promise<Task[]>;
/**
 * Admin Withdrawal Management
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
/**
 * Get all pending withdrawal requests
 * Requirement 11.1: Display all pending Withdrawal Requests
 */
export declare function getPendingWithdrawals(): Promise<(Withdrawal & {
    user: Pick<User, "username" | "telegram_id">;
})[]>;
/**
 * Approve a withdrawal request
 * Requirements: 11.3, 11.4
 */
export declare function approveWithdrawal(withdrawalId: number): Promise<Withdrawal>;
/**
 * Reject a withdrawal request
 * Requirements: 11.5, 11.6
 */
export declare function rejectWithdrawal(withdrawalId: number, reason: string): Promise<Withdrawal>;
/**
 * Admin Statistics
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */
export interface AdminStats {
    totalUsers: number;
    totalTasksCompleted: number;
    totalStarsDistributed: number;
    pendingWithdrawalsAmount: number;
}
/**
 * Get admin statistics
 */
export declare function getAdminStats(): Promise<AdminStats>;
/**
 * Referral Tree
 * Requirements: 12.5, 12.6
 */
export interface ReferralNode {
    id: number;
    telegramId: number;
    username?: string;
    firstName: string;
    referralCount: number;
    totalEarnings: number;
    referrals: ReferralNode[];
}
/**
 * Get complete referral tree (all top-level users)
 */
export declare function getReferralTree(): Promise<ReferralNode[]>;
//# sourceMappingURL=adminService.d.ts.map