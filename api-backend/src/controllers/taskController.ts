import { Request, Response } from "express";
import {
  getTasksWithCompletionStatus,
  getTaskById,
  isTaskCompletedByUser,
  markTaskCompleted,
} from "../services/taskService.js";
import {
  createTransaction,
  updateUserBalance,
} from "../services/transactionService.js";
import { processReferralBonus } from "../services/referralService.js";
import { logger } from "../utils/logger.js";
import axios from "axios";

const BOT_BACKEND_URL = process.env.BOT_BACKEND_URL || "http://localhost:3001";

/**
 * Get all tasks with completion status for the authenticated user
 * GET /api/tasks
 */
export async function getTasks(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
        statusCode: 401,
      });
    }

    const tasks = await getTasksWithCompletionStatus(userId);

    return res.status(200).json({ tasks });
  } catch (error) {
    logger.error("Error getting tasks", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to fetch tasks",
      statusCode: 500,
    });
  }
}

/**
 * Verify task completion
 * POST /api/tasks/:id/verify
 */
export async function verifyTask(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const taskId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
        statusCode: 401,
      });
    }

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid task ID",
        statusCode: 400,
      });
    }

    // Check if task exists
    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        error: "NotFound",
        message: "Task not found",
        statusCode: 404,
      });
    }

    // Check if task is active
    if (task.status !== "active") {
      return res.status(400).json({
        error: "BadRequest",
        message: "Task is not active",
        statusCode: 400,
      });
    }

    // Check if user already completed this task
    const alreadyCompleted = await isTaskCompletedByUser(userId, taskId);
    if (alreadyCompleted) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Task already completed",
        statusCode: 400,
      });
    }

    // Verify based on task type
    let verified = false;

    if (task.type === "channel") {
      // Verify channel subscription via bot backend
      try {
        const response = await axios.post(`${BOT_BACKEND_URL}/verify/channel`, {
          userId,
          channelUsername: task.target,
        });
        verified = response.data.verified;
      } catch (error) {
        logger.error("Error verifying channel subscription", {
          userId,
          taskId,
          error,
        });
        return res.status(500).json({
          error: "ServerError",
          message: "Failed to verify subscription",
          statusCode: 500,
        });
      }
    } else if (task.type === "bot") {
      // Verify bot activation via bot backend
      try {
        const response = await axios.post(`${BOT_BACKEND_URL}/verify/bot`, {
          userId,
          taskId,
        });
        verified = response.data.verified;
      } catch (error) {
        logger.error("Error verifying bot activation", {
          userId,
          taskId,
          error,
        });
        return res.status(500).json({
          error: "ServerError",
          message: "Failed to verify activation",
          statusCode: 500,
        });
      }
    }

    if (!verified) {
      return res.status(400).json({
        error: "VerificationFailed",
        message: "Task verification failed",
        statusCode: 400,
      });
    }

    // Mark task as completed
    await markTaskCompleted(userId, taskId);

    // Create transaction and update balance
    try {
      await updateUserBalance(userId, task.reward);
      await createTransaction(userId, "task", task.reward, taskId);
    } catch (error) {
      logger.error("Error creating transaction", { userId, taskId, error });
      // Task is marked as completed but transaction failed
      // This is a critical error that needs manual intervention
      return res.status(500).json({
        error: "ServerError",
        message: "Task completed but reward processing failed",
        statusCode: 500,
      });
    }

    // Process referral bonus (5% to referrer)
    await processReferralBonus(userId, taskId, task.reward);

    logger.info("Task verified and completed", { userId, taskId });

    return res.status(200).json({
      success: true,
      reward: task.reward,
      message: "Task completed successfully",
    });
  } catch (error) {
    logger.error("Error verifying task", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to verify task",
      statusCode: 500,
    });
  }
}
