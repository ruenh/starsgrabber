import { supabase } from "../config/supabase.js";
import { Transaction } from "../types/index.js";
import logger from "../utils/logger.js";

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
export async function createTransaction(
  userId: number,
  type: "task" | "referral" | "withdrawal",
  amount: number,
  taskId?: number,
  referralId?: number,
  withdrawalId?: number
): Promise<Transaction> {
  try {
    // Start a transaction by creating the record
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type,
        amount,
        task_id: taskId,
        referral_id: referralId,
        withdrawal_id: withdrawalId,
      })
      .select()
      .single();

    if (transactionError) {
      throw transactionError;
    }

    // Update user balance
    const { error: balanceError } = await supabase.rpc("update_user_balance", {
      p_user_id: userId,
      p_amount: amount,
    });

    if (balanceError) {
      // If balance update fails, we should ideally rollback the transaction
      // For now, log the error
      logger.error("Error updating user balance", {
        userId,
        amount,
        error: balanceError,
      });
      throw balanceError;
    }

    logger.info("Transaction created", {
      userId,
      type,
      amount,
      transactionId: transaction.id,
    });

    return transaction;
  } catch (error) {
    logger.error("Error creating transaction", {
      userId,
      type,
      amount,
      error,
    });
    throw error;
  }
}

/**
 * Update user balance directly (alternative method if RPC doesn't exist)
 * @param userId - User ID
 * @param amount - Amount to add (can be negative)
 */
export async function updateUserBalance(
  userId: number,
  amount: number
): Promise<void> {
  try {
    // Get current balance
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const newBalance = user.balance + amount;

    // Update balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    logger.info("User balance updated", { userId, amount, newBalance });
  } catch (error) {
    logger.error("Error updating user balance", { userId, amount, error });
    throw error;
  }
}
