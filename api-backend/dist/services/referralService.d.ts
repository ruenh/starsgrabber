import { Transaction } from "../types/index.js";
/**
 * Generate referral link for a user
 * @param telegramId - User's Telegram ID
 * @param botUsername - Bot username (from env)
 * @returns Referral link
 */
export declare function generateReferralLink(telegramId: number, botUsername: string): string;
/**
 * Process referral bonus when a user completes a task
 * Adds 5% of task reward to referrer's balance
 * @param userId - User who completed the task
 * @param taskId - Task ID
 * @param taskReward - Task reward amount
 */
export declare function processReferralBonus(userId: number, taskId: number, taskReward: number): Promise<void>;
/**
 * Get referral statistics for a user
 * @param userId - User ID
 * @returns Referral stats including referrals list and total earnings
 */
export declare function getReferralStats(userId: number): Promise<{
    referrals: {
        id: any;
        telegram_id: any;
        username: any;
        first_name: any;
        last_name: any;
        avatar_url: any;
        created_at: any;
    }[];
    totalReferrals: number;
    totalEarnings: number;
}>;
/**
 * Get detailed referral transactions for a user
 * @param userId - User ID
 * @returns List of referral transactions with details
 */
export declare function getReferralTransactions(userId: number): Promise<Transaction[]>;
//# sourceMappingURL=referralService.d.ts.map