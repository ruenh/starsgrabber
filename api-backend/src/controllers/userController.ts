import { Request, Response } from "express";
import { getUserProfile } from "../services/userService.js";
import logger from "../utils/logger.js";

/**
 * Get user profile
 * GET /api/user/profile
 */
export async function getProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
        statusCode: 401,
      });
    }

    const profile = await getUserProfile(req.user.userId);

    return res.status(200).json({
      user: profile,
    });
  } catch (error) {
    logger.error("Error getting user profile", {
      userId: req.user?.userId,
      error,
    });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to fetch user profile",
      statusCode: 500,
    });
  }
}
