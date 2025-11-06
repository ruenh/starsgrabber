import { supabase } from "../config/supabase.js";
import { Task, Withdrawal, User } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { updateUserBalance } from "./transactionService.js";

/**
 * Admin Task Management
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7
 */

/**
 * Create a new task
 * Requirement 10.4: Create Task record and set status to active
 */
export async function createTask(taskData: {
  type: "channel" | "bot";
  title: string;
  description?: string;
  reward: number;
  target: string;
  avatar_url?: string;
}): Promise<Task> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...taskData,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Task created by admin", { taskId: data.id });
    return data;
  } catch (error) {
    logger.error("Error creating task", { taskData, error });
    throw error;
  }
}

/**
 * Update an existing task
 * Requirement 10.5: Update Task record with new values
 */
export async function updateTask(
  taskId: number,
  taskData: {
    type?: "channel" | "bot";
    title?: string;
    description?: string;
    reward?: number;
    target?: string;
    avatar_url?: string;
  }
): Promise<Task> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        ...taskData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Task updated by admin", { taskId });
    return data;
  } catch (error) {
    logger.error("Error updating task", { taskId, taskData, error });
    throw error;
  }
}

/**
 * Close a task (set status to inactive)
 * Requirement 10.6: Set Task status to inactive
 */
export async function closeTask(taskId: number): Promise<Task> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Task closed by admin", { taskId });
    return data;
  } catch (error) {
    logger.error("Error closing task", { taskId, error });
    throw error;
  }
}

/**
 * Get all tasks (including inactive)
 * Requirement 10.1: Display list of all Tasks with status
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error("Error getting all tasks", { error });
    throw error;
  }
}

/**
 * Admin Withdrawal Management
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */

/**
 * Get all pending withdrawal requests
 * Requirement 11.1: Display all pending Withdrawal Requests
 */
export async function getPendingWithdrawals(): Promise<
  (Withdrawal & { user: Pick<User, "username" | "telegram_id"> })[]
> {
  try {
    const { data, error } = await supabase
      .from("withdrawals")
      .select(
        `
        *,
        users!inner (
          username,
          telegram_id
        )
      `
      )
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    // Transform the data to flatten user info
    return (
      data?.map((item: any) => ({
        ...item,
        user: item.users,
        users: undefined,
      })) || []
    );
  } catch (error) {
    logger.error("Error getting pending withdrawals", { error });
    throw error;
  }
}

/**
 * Approve a withdrawal request
 * Requirements: 11.3, 11.4
 */
export async function approveWithdrawal(
  withdrawalId: number
): Promise<Withdrawal> {
  try {
    // Get withdrawal details
    const { data: withdrawal, error: fetchError } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("id", withdrawalId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (withdrawal.status !== "pending") {
      throw new Error("Withdrawal is not in pending status");
    }

    // Update withdrawal status to approved
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from("withdrawals")
      .update({
        status: "approved",
        processed_at: new Date().toISOString(),
      })
      .eq("id", withdrawalId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Deduct stars from user balance
    await updateUserBalance(withdrawal.user_id, -withdrawal.amount);

    // Create transaction record
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: withdrawal.user_id,
        type: "withdrawal",
        amount: -withdrawal.amount,
        withdrawal_id: withdrawalId,
      });

    if (transactionError) {
      logger.error("Error creating withdrawal transaction", {
        withdrawalId,
        error: transactionError,
      });
    }

    logger.info("Withdrawal approved by admin", {
      withdrawalId,
      userId: withdrawal.user_id,
      amount: withdrawal.amount,
    });

    return updatedWithdrawal;
  } catch (error) {
    logger.error("Error approving withdrawal", { withdrawalId, error });
    throw error;
  }
}

/**
 * Reject a withdrawal request
 * Requirements: 11.5, 11.6
 */
export async function rejectWithdrawal(
  withdrawalId: number,
  reason: string
): Promise<Withdrawal> {
  try {
    // Update withdrawal status to rejected with reason
    const { data, error } = await supabase
      .from("withdrawals")
      .update({
        status: "rejected",
        rejection_reason: reason,
        processed_at: new Date().toISOString(),
      })
      .eq("id", withdrawalId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Withdrawal rejected by admin", {
      withdrawalId,
      reason,
    });

    return data;
  } catch (error) {
    logger.error("Error rejecting withdrawal", { withdrawalId, error });
    throw error;
  }
}

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
export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (usersError) {
      throw usersError;
    }

    // Get total tasks completed count
    const { count: totalTasksCompleted, error: tasksError } = await supabase
      .from("user_tasks")
      .select("*", { count: "exact", head: true });

    if (tasksError) {
      throw tasksError;
    }

    // Get total stars distributed (sum of positive transactions)
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select("amount")
      .in("type", ["task", "referral"]);

    if (transactionsError) {
      throw transactionsError;
    }

    const totalStarsDistributed =
      transactionsData?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

    // Get pending withdrawals amount
    const { data: withdrawalsData, error: withdrawalsError } = await supabase
      .from("withdrawals")
      .select("amount")
      .eq("status", "pending");

    if (withdrawalsError) {
      throw withdrawalsError;
    }

    const pendingWithdrawalsAmount =
      withdrawalsData?.reduce((sum, w) => sum + w.amount, 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      totalTasksCompleted: totalTasksCompleted || 0,
      totalStarsDistributed,
      pendingWithdrawalsAmount,
    };
  } catch (error) {
    logger.error("Error getting admin stats", { error });
    throw error;
  }
}

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
 * Get referral tree for a user
 */
async function getUserReferralTree(userId: number): Promise<ReferralNode> {
  try {
    // Get user info
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      throw userError;
    }

    // Get direct referrals
    const { data: referrals, error: referralsError } = await supabase
      .from("users")
      .select("*")
      .eq("referrer_id", userId);

    if (referralsError) {
      throw referralsError;
    }

    // Get referral earnings for this user
    const { data: earnings, error: earningsError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "referral");

    if (earningsError) {
      throw earningsError;
    }

    const totalEarnings = earnings?.reduce((sum, t) => sum + t.amount, 0) || 0;

    // Recursively build tree for each referral
    const referralNodes = await Promise.all(
      (referrals || []).map((ref) => getUserReferralTree(ref.id))
    );

    return {
      id: user.id,
      telegramId: user.telegram_id,
      username: user.username,
      firstName: user.first_name,
      referralCount: referrals?.length || 0,
      totalEarnings,
      referrals: referralNodes,
    };
  } catch (error) {
    logger.error("Error getting user referral tree", { userId, error });
    throw error;
  }
}

/**
 * Get complete referral tree (all top-level users)
 */
export async function getReferralTree(): Promise<ReferralNode[]> {
  try {
    // Get all users without referrers (top-level)
    const { data: topLevelUsers, error } = await supabase
      .from("users")
      .select("id")
      .is("referrer_id", null);

    if (error) {
      throw error;
    }

    // Build tree for each top-level user
    const trees = await Promise.all(
      (topLevelUsers || []).map((user) => getUserReferralTree(user.id))
    );

    return trees;
  } catch (error) {
    logger.error("Error getting referral tree", { error });
    throw error;
  }
}
