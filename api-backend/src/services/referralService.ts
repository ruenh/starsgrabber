import { supabase } from "../config/supabase.js";
import { Transaction } from "../types/index.js";
import logger from "../utils/logger.js";
import { createTransaction, updateUserBalance } from "./transactionService.js";

/**
 * Generate referral link for a user
 * @param telegramId - User's Telegram ID
 * @param botUsername - Bot username (from env)
 * @returns Referral link
 */
export function generateReferralLink(
  telegramId: number,
  botUsername: string
): string {
  // Referral code is the user's telegram_id
  const referralCode = telegramId.toString();
  return `https://t.me/${botUsername}?start=${referralCode}`;
}

/**
 * Process referral bonus when a user completes a task
 * Adds 5% of task reward to referrer's balance
 * @param userId - User who completed the task
 * @param taskId - Task ID
 * @param taskReward - Task reward amount
 */
export async function processReferralBonus(
  userId: number,
  taskId: number,
  taskReward: number
): Promise<void> {
  try {
    // Get user's referrer
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("referrer_id")
      .eq("id", userId)
      .single();

    if (userError) {
      throw userError;
    }

    // If user has no referrer, nothing to do
    if (!user.referrer_id) {
      return;
    }

    // Calculate 5% referral bonus
    const referralBonus = Math.floor(taskReward * 0.05);

    if (referralBonus <= 0) {
      logger.warn("Referral bonus is 0 or negative", {
        userId,
        taskId,
        taskReward,
      });
      return;
    }

    // Update referrer's balance
    await updateUserBalance(user.referrer_id, referralBonus);

    // Create referral transaction for the referrer
    await createTransaction(
      user.referrer_id,
      "referral",
      referralBonus,
      taskId,
      userId // referral_id is the user who completed the task
    );

    logger.info("Referral bonus processed", {
      referrerId: user.referrer_id,
      referralUserId: userId,
      taskId,
      bonus: referralBonus,
    });
  } catch (error) {
    logger.error("Error processing referral bonus", {
      userId,
      taskId,
      taskReward,
      error,
    });
    // Don't throw - referral bonus failure shouldn't block task completion
  }
}

/**
 * Get referral statistics for a user
 * @param userId - User ID
 * @returns Referral stats including referrals list and total earnings
 */
export async function getReferralStats(userId: number) {
  try {
    // Get all users who were referred by this user
    const { data: referrals, error: referralsError } = await supabase
      .from("users")
      .select(
        "id, telegram_id, username, first_name, last_name, avatar_url, created_at"
      )
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (referralsError) {
      throw referralsError;
    }

    // Get all referral transactions (earnings from referrals)
    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "referral");

    if (transactionsError) {
      throw transactionsError;
    }

    // Calculate total earnings
    const totalEarnings = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    return {
      referrals: referrals || [],
      totalReferrals: referrals?.length || 0,
      totalEarnings,
    };
  } catch (error) {
    logger.error("Error getting referral stats", { userId, error });
    throw error;
  }
}

/**
 * Get detailed referral transactions for a user
 * @param userId - User ID
 * @returns List of referral transactions with details
 */
export async function getReferralTransactions(
  userId: number
): Promise<Transaction[]> {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "referral")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return transactions || [];
  } catch (error) {
    logger.error("Error getting referral transactions", { userId, error });
    throw error;
  }
}
