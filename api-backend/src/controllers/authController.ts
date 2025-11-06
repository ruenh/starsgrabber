import { Request, Response } from "express";
import {
  findUserByTelegramId,
  createUser,
  updateUser,
  findReferrerByCode,
} from "../services/userService.js";
import { generateToken } from "../utils/jwt.js";
import { TelegramUser } from "../types/auth.js";
import { logger } from "../utils/logger.js";

/**
 * Login/Register endpoint
 * Handles both new user registration and existing user login
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
  try {
    const telegramUser: TelegramUser = req.body.telegramUser;
    const referralCode: string | undefined = req.body.referralCode;

    if (!telegramUser) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Missing telegram user data",
        statusCode: 400,
      });
    }

    // Check if user exists
    let user = await findUserByTelegramId(telegramUser.id);

    if (user) {
      // Existing user - update their info
      user = await updateUser(user.id, telegramUser);
      logger.info("User logged in", {
        userId: user.id,
        telegramId: telegramUser.id,
      });
    } else {
      // New user - register
      let referrerId: number | undefined;

      // Handle referral linking
      if (referralCode) {
        referrerId = (await findReferrerByCode(referralCode)) || undefined;
        if (referrerId) {
          logger.info("User registered with referral", {
            telegramId: telegramUser.id,
            referrerId,
          });
        }
      }

      user = await createUser(telegramUser, referrerId);
    }

    // Generate JWT token
    const token = generateToken(user.id, user.telegram_id);

    // Return user data and token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
        balance: user.balance,
        referrerId: user.referrer_id,
      },
    });
  } catch (error) {
    logger.error("Error in login", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to authenticate user",
      statusCode: 500,
    });
  }
}
