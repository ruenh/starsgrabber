import { Request, Response } from "express";
import {
  getReferralStats,
  generateReferralLink,
} from "../services/referralService.js";
import { logger } from "../utils/logger.js";

const BOT_USERNAME = process.env.BOT_USERNAME || "stars_grabber_bot";

/**
 * Get referral statistics for the authenticated user
 * GET /api/referrals
 */
export async function getReferrals(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const telegramId = req.user?.telegramId;

    if (!userId || !telegramId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
        statusCode: 401,
      });
    }

    // Get referral stats
    const stats = await getReferralStats(userId);

    // Generate referral link
    const referralLink = generateReferralLink(telegramId, BOT_USERNAME);

    // Transform referrals to camelCase for frontend
    const referrals = stats.referrals.map((referral) => ({
      id: referral.id,
      telegramId: referral.telegram_id,
      username: referral.username,
      firstName: referral.first_name,
      lastName: referral.last_name,
      avatarUrl: referral.avatar_url,
      createdAt: referral.created_at,
    }));

    return res.status(200).json({
      referralLink,
      referrals,
      totalReferrals: stats.totalReferrals,
      totalEarnings: stats.totalEarnings,
    });
  } catch (error) {
    logger.error("Error getting referrals", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to fetch referral data",
      statusCode: 500,
    });
  }
}
