import { Request, Response } from "express";
import {
  createTask,
  updateTask,
  closeTask,
  getAllTasks,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getAdminStats,
  getReferralTree,
} from "../services/adminService.js";
import { logger } from "../utils/logger.js";
import axios from "axios";

const BOT_BACKEND_URL = process.env.BOT_BACKEND_URL || "http://localhost:3001";

/**
 * Task Management Controllers
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7
 */

/**
 * Get all tasks (including inactive)
 * GET /api/admin/tasks
 */
export async function getAllTasksAdmin(_req: Request, res: Response) {
  try {
    const tasks = await getAllTasks();

    return res.status(200).json({ tasks });
  } catch (error) {
    logger.error("Error getting all tasks", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to get tasks",
      statusCode: 500,
    });
  }
}

/**
 * Create a new task
 * POST /api/admin/tasks
 * Requirement 10.3: Allow Admin to specify task type, title, reward amount, channel username or bot link
 */
export async function createTaskAdmin(req: Request, res: Response) {
  try {
    const { type, title, description, reward, target, avatar_url } = req.body;

    // Validate required fields
    if (!type || !title || !reward || !target) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Missing required fields: type, title, reward, target",
        statusCode: 400,
      });
    }

    // Validate task type
    if (type !== "channel" && type !== "bot") {
      return res.status(400).json({
        error: "BadRequest",
        message: "Task type must be 'channel' or 'bot'",
        statusCode: 400,
      });
    }

    // Validate reward is positive
    if (reward <= 0) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Reward must be a positive number",
        statusCode: 400,
      });
    }

    const task = await createTask({
      type,
      title,
      description,
      reward,
      target,
      avatar_url,
    });

    // Requirement 10.7: Send notification to all users about new task
    try {
      await axios.post(`${BOT_BACKEND_URL}/notifications/new-task`, {
        taskId: task.id,
        taskTitle: task.title,
        reward: task.reward,
      });
    } catch (notifError) {
      logger.error("Error sending new task notification", { notifError });
      // Don't fail the request if notification fails
    }

    return res.status(201).json({ task });
  } catch (error) {
    logger.error("Error creating task", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to create task",
      statusCode: 500,
    });
  }
}

/**
 * Update an existing task
 * PUT /api/admin/tasks/:id
 */
export async function updateTaskAdmin(req: Request, res: Response) {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { type, title, description, reward, target, avatar_url } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid task ID",
        statusCode: 400,
      });
    }

    // Validate task type if provided
    if (type && type !== "channel" && type !== "bot") {
      return res.status(400).json({
        error: "BadRequest",
        message: "Task type must be 'channel' or 'bot'",
        statusCode: 400,
      });
    }

    // Validate reward if provided
    if (reward !== undefined && reward <= 0) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Reward must be a positive number",
        statusCode: 400,
      });
    }

    const task = await updateTask(taskId, {
      type,
      title,
      description,
      reward,
      target,
      avatar_url,
    });

    return res.status(200).json({ task });
  } catch (error) {
    logger.error("Error updating task", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to update task",
      statusCode: 500,
    });
  }
}

/**
 * Close a task (set status to inactive)
 * PATCH /api/admin/tasks/:id/close
 */
export async function closeTaskAdmin(req: Request, res: Response) {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid task ID",
        statusCode: 400,
      });
    }

    const task = await closeTask(taskId);

    return res.status(200).json({ task });
  } catch (error) {
    logger.error("Error closing task", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to close task",
      statusCode: 500,
    });
  }
}

/**
 * Withdrawal Management Controllers
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */

/**
 * Get all pending withdrawal requests
 * GET /api/admin/withdrawals
 * Requirement 11.2: Display User username, amount, and request date for each Withdrawal Request
 */
export async function getPendingWithdrawalsAdmin(_req: Request, res: Response) {
  try {
    const withdrawals = await getPendingWithdrawals();

    return res.status(200).json({ withdrawals });
  } catch (error) {
    logger.error("Error getting pending withdrawals", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to get pending withdrawals",
      statusCode: 500,
    });
  }
}

/**
 * Approve a withdrawal request
 * POST /api/admin/withdrawals/:id/approve
 * Requirements: 11.3, 11.4
 */
export async function approveWithdrawalAdmin(req: Request, res: Response) {
  try {
    const withdrawalId = parseInt(req.params.id, 10);

    if (isNaN(withdrawalId)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid withdrawal ID",
        statusCode: 400,
      });
    }

    const withdrawal = await approveWithdrawal(withdrawalId);

    // Requirement 11.4: Send notification to User
    try {
      await axios.post(`${BOT_BACKEND_URL}/notifications/withdrawal-approved`, {
        userId: withdrawal.user_id,
        amount: withdrawal.amount,
      });
    } catch (notifError) {
      logger.error("Error sending withdrawal approval notification", {
        notifError,
      });
      // Don't fail the request if notification fails
    }

    return res.status(200).json({ withdrawal });
  } catch (error) {
    logger.error("Error approving withdrawal", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to approve withdrawal",
      statusCode: 500,
    });
  }
}

/**
 * Reject a withdrawal request
 * POST /api/admin/withdrawals/:id/reject
 * Requirements: 11.5, 11.6
 */
export async function rejectWithdrawalAdmin(req: Request, res: Response) {
  try {
    const withdrawalId = parseInt(req.params.id, 10);
    const { reason } = req.body;

    if (isNaN(withdrawalId)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid withdrawal ID",
        statusCode: 400,
      });
    }

    if (!reason) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Rejection reason is required",
        statusCode: 400,
      });
    }

    const withdrawal = await rejectWithdrawal(withdrawalId, reason);

    // Requirement 11.6: Send notification to User with rejection reason
    try {
      await axios.post(`${BOT_BACKEND_URL}/notifications/withdrawal-rejected`, {
        userId: withdrawal.user_id,
        amount: withdrawal.amount,
        reason,
      });
    } catch (notifError) {
      logger.error("Error sending withdrawal rejection notification", {
        notifError,
      });
      // Don't fail the request if notification fails
    }

    return res.status(200).json({ withdrawal });
  } catch (error) {
    logger.error("Error rejecting withdrawal", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to reject withdrawal",
      statusCode: 500,
    });
  }
}

/**
 * Statistics and Monitoring Controllers
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 */

/**
 * Get admin statistics
 * GET /api/admin/stats
 */
export async function getStatsAdmin(_req: Request, res: Response) {
  try {
    const stats = await getAdminStats();

    return res.status(200).json(stats);
  } catch (error) {
    logger.error("Error getting admin stats", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to get statistics",
      statusCode: 500,
    });
  }
}

/**
 * Get referral tree
 * GET /api/admin/referral-tree
 * Requirements: 12.5, 12.6
 */
export async function getReferralTreeAdmin(_req: Request, res: Response) {
  try {
    const tree = await getReferralTree();

    return res.status(200).json({ tree });
  } catch (error) {
    logger.error("Error getting referral tree", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to get referral tree",
      statusCode: 500,
    });
  }
}
