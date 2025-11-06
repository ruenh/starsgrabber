import { supabase } from "../config/supabase.js";
import { Withdrawal, Task } from "../types/index.js";
import { logger } from "../utils/logger.js";
import axios from "axios";
import { updateUserBalance } from "./transactionService.js";

const BOT_BACKEND_URL = process.env.BOT_BACKEND_URL || "http://localhost:3001";

/**
 * Validate withdrawal request
 * Requirements: 7.1, 7.2, 7.3
 */
export async function validateWithdrawalRequest(
  userId: number,
  amount: number
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Requirement 7.2: Validate minimum 100 stars
    if (amount < 100) {
      return {
        valid: false,
        error: "Minimum withdrawal amount is 100 stars",
      };
    }

    // Requirement 7.3: Validate sufficient balance
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("balance, username")
      .eq("id", userId)
      .single();

    if (userError) {
      throw userError;
    }

    if (user.balance < amount) {
      return {
        valid: false,
        error: "Insufficient balance",
      };
    }

    // Requirement 7.4: Check if user has Telegram username
    if (!user.username) {
      return {
        valid: false,
        error:
          "Telegram username is required for withdrawal. Please set your username in Telegram settings.",
      };
    }

    return { valid: true };
  } catch (error) {
    logger.error("Error validating withdrawal request", {
      userId,
      amount,
      error,
    });
    throw error;
  }
}

/**
 * Get user's completed channel subscription tasks
 * Requirement 7.6: Verify all completed channel subscriptions are still active
 */
export async function getUserCompletedChannelTasks(
  userId: number
): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from("user_tasks")
      .select(
        `
        task_id,
        tasks (
          id,
          type,
          title,
          reward,
          target,
          status
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    // Filter for channel tasks only
    const channelTasks = data
      .filter((ut: any) => ut.tasks && ut.tasks.type === "channel")
      .map((ut: any) => ut.tasks);

    return channelTasks;
  } catch (error) {
    logger.error("Error getting user completed channel tasks", {
      userId,
      error,
    });
    throw error;
  }
}

/**
 * Verify channel subscriptions are still active
 * Requirements: 7.6, 7.7
 */
export async function verifyActiveSubscriptions(
  userId: number
): Promise<{ allActive: boolean; inactiveTasks: Task[] }> {
  try {
    const channelTasks = await getUserCompletedChannelTasks(userId);
    const inactiveTasks: Task[] = [];

    // Check each channel subscription
    for (const task of channelTasks) {
      try {
        const response = await axios.post(`${BOT_BACKEND_URL}/verify/channel`, {
          userId,
          channelUsername: task.target,
        });

        if (!response.data.verified) {
          inactiveTasks.push(task);
        }
      } catch (error) {
        logger.error("Error verifying channel subscription", {
          userId,
          taskId: task.id,
          error,
        });
        // If verification fails, consider it inactive
        inactiveTasks.push(task);
      }
    }

    return {
      allActive: inactiveTasks.length === 0,
      inactiveTasks,
    };
  } catch (error) {
    logger.error("Error verifying active subscriptions", { userId, error });
    throw error;
  }
}

/**
 * Deduct stars for inactive subscriptions
 * Requirement 7.7: If any channel subscription is inactive, deduct Stars for that Task
 * Uses database transaction to ensure atomicity
 */
export async function deductStarsForInactiveSubscriptions(
  userId: number,
  inactiveTasks: Task[]
): Promise<number> {
  try {
    let totalDeducted = 0;
    const taskIds = inactiveTasks.map((t) => t.id);
    const totalReward = inactiveTasks.reduce((sum, t) => sum + t.reward, 0);

    // Use a single transaction to ensure atomicity
    // First, delete all inactive task records
    const { error: deleteError } = await supabase
      .from("user_tasks")
      .delete()
      .eq("user_id", userId)
      .in("task_id", taskIds);

    if (deleteError) {
      logger.error("Error removing inactive tasks", {
        userId,
        taskIds,
        error: deleteError,
      });
      throw deleteError;
    }

    // Then deduct the total reward from user balance
    await updateUserBalance(userId, -totalReward);
    totalDeducted = totalReward;

    logger.info("Stars deducted for inactive subscriptions", {
      userId,
      taskCount: inactiveTasks.length,
      totalAmount: totalDeducted,
    });

    return totalDeducted;
  } catch (error) {
    logger.error("Error deducting stars for inactive subscriptions", {
      userId,
      error,
    });
    throw error;
  }
}

/**
 * Create withdrawal request
 * Requirements: 7.8, 7.9
 */
export async function createWithdrawalRequest(
  userId: number,
  amount: number
): Promise<Withdrawal> {
  try {
    // Validate withdrawal
    const validation = await validateWithdrawalRequest(userId, amount);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Verify active subscriptions
    const { allActive, inactiveTasks } = await verifyActiveSubscriptions(
      userId
    );

    if (!allActive) {
      // Deduct stars for inactive subscriptions
      const deducted = await deductStarsForInactiveSubscriptions(
        userId,
        inactiveTasks
      );

      throw new Error(
        `Withdrawal rejected: ${inactiveTasks.length} inactive subscription(s) detected. ${deducted} stars deducted. Please re-complete the tasks.`
      );
    }

    // Create withdrawal request with pending status
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from("withdrawals")
      .insert({
        user_id: userId,
        amount,
        status: "pending",
      })
      .select()
      .single();

    if (withdrawalError) {
      throw withdrawalError;
    }

    logger.info("Withdrawal request created", {
      userId,
      amount,
      withdrawalId: withdrawal.id,
    });

    return withdrawal;
  } catch (error) {
    logger.error("Error creating withdrawal request", {
      userId,
      amount,
      error,
    });
    throw error;
  }
}

/**
 * Get user withdrawals
 * Requirement 8.1, 8.2, 8.3, 8.4, 8.5
 */
export async function getUserWithdrawals(
  userId: number
): Promise<Withdrawal[]> {
  try {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error("Error getting user withdrawals", { userId, error });
    throw error;
  }
}

/**
 * Get withdrawal by ID
 */
export async function getWithdrawalById(
  withdrawalId: number
): Promise<Withdrawal | null> {
  try {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("id", withdrawalId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    logger.error("Error getting withdrawal by ID", { withdrawalId, error });
    throw error;
  }
}

/**
 * Update withdrawal status
 */
export async function updateWithdrawalStatus(
  withdrawalId: number,
  status: "approved" | "rejected",
  rejectionReason?: string
): Promise<Withdrawal> {
  try {
    const updateData: any = {
      status,
      processed_at: new Date().toISOString(),
    };

    if (status === "rejected" && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { data, error } = await supabase
      .from("withdrawals")
      .update(updateData)
      .eq("id", withdrawalId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Withdrawal status updated", {
      withdrawalId,
      status,
    });

    return data;
  } catch (error) {
    logger.error("Error updating withdrawal status", {
      withdrawalId,
      status,
      error,
    });
    throw error;
  }
}
