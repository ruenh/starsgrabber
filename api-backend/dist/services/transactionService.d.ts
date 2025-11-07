import { Transaction } from "../types/index.js";
/**
 * Create a transaction and update user balance
 * @param userId - User ID
 * @param type - Transaction type
 * @param amount - Transaction amount (positive for earnings, negative for withdrawals)
 * @param taskId - Optional task ID
 * @param referralId - Optional referral user ID
 * @param withdrawalId - Optional withdrawal ID
 * @returns Created transaction
 */
export declare function createTransaction(userId: number, type: "task" | "referral" | "withdrawal", amount: number, taskId?: number, referralId?: number, withdrawalId?: number): Promise<Transaction>;
/**
 * Update user balance directly (alternative method if RPC doesn't exist)
 * @param userId - User ID
 * @param amount - Amount to add (can be negative)
 */
export declare function updateUserBalance(userId: number, amount: number): Promise<void>;
//# sourceMappingURL=transactionService.d.ts.map