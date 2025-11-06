import { Request, Response } from "express";
import {
  createWithdrawalRequest,
  getUserWithdrawals,
} from "../services/withdrawalService.js";
import { NotificationService } from "../services/notificationService.js";
import logger from "../utils/logger.js";
import { supabase } from "../config/supabase.js";

/**
 * Create withdrawal request
 * POST /api/withdrawals
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9
 */
export async function createWithdrawal(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { amount } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
        statusCode: 401,
      });
    }

    // Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid withdrawal amount",
        statusCode: 400,
      });
    }

    // Create withdrawal request (includes all validations and subscription checks)
    const withdrawal = await createWithdrawalRequest(userId, amount);

    // Get user info for notification
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username, telegram_id")
      .eq("id", userId)
      .single();

    if (userError) {
      logger.error("Error fetching user for notification", {
        userId,
        error: userError,
      });
    }

    // Requirement 7.9: Send notification to admin
    if (user && user.username) {
      await NotificationService.notifyAdminWithdrawalRequest(
        user.username,
        amount,
        userId,
        withdrawal.id
      );
    }

    logger.info("Withdrawal request created successfully", {
      userId,
      withdrawalId: withdrawal.id,
      amount,
    });

    return res.status(201).json({
      withdrawal,
      message: "Withdrawal request created successfully",
    });
  } catch (error: any) {
    logger.error("Error creating withdrawal", { error });

    // Handle specific validation errors
    if (error.message) {
      return res.status(400).json({
        error: "ValidationError",
        message: error.message,
        statusCode: 400,
      });
    }

    return res.status(500).json({
      error: "ServerError",
      message: "Failed to create withdrawal request",
      statusCode: 500,
    });
  }
}

/**
 * Get user withdrawals
 * GET /api/withdrawals
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export async function getWithdrawals(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
        statusCode: 401,
      });
    }

    const withdrawals = await getUserWithdrawals(userId);

    return res.status(200).json({
      withdrawals,
    });
  } catch (error) {
    logger.error("Error getting withdrawals", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to fetch withdrawals",
      statusCode: 500,
    });
  }
}
