import { Bot } from "grammy";
import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import { supabase } from "./config/supabase.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import { BotActivationService } from "./services/botActivationService.js";

// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_PORT = parseInt(process.env.BOT_PORT || "3001");

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in environment variables");
}

// Create Express app for HTTP endpoints
const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "bot-backend" });
});

// Notification routes
app.use("/notifications", notificationRoutes);

// Verification routes
app.use("/verify", verificationRoutes);

// Create bot instance
const bot = new Bot(BOT_TOKEN);

// Command handlers
bot.command("start", async (ctx) => {
  const startParam = ctx.match;
  const userId = ctx.from?.id;

  if (!userId) {
    return;
  }

  logger.info(`User ${userId} started bot with param: ${startParam}`);

  // If start param exists, it's a bot activation tracking link
  if (startParam) {
    // Parse the tracking parameter (format: task_<taskId>_user_<userId>)
    const match = startParam.match(/task_(\d+)_user_(\d+)/);

    if (match) {
      const taskId = parseInt(match[1]);
      const trackingUserId = parseInt(match[2]);

      // Record bot activation using service
      await BotActivationService.recordActivation(trackingUserId, taskId);
    }
  }

  await ctx.reply(
    "👋 Добро пожаловать в Stars Grabber Bot!\n\n" +
      "Этот бот используется для проверки выполнения заданий.\n" +
      "Откройте Mini App для начала работы."
  );
});

// Error handling
bot.catch((err) => {
  logger.error("Bot error:", err);
});

// Start Express server
app.listen(BOT_PORT, () => {
  logger.info(`Bot backend HTTP server listening on port ${BOT_PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);

  // Signal PM2 that the app is ready
  if (process.send) {
    process.send("ready");
  }
});

// Start bot
if (process.env.NODE_ENV === "production" && process.env.WEBHOOK_DOMAIN) {
  // Use webhooks in production
  const webhookUrl = `${process.env.WEBHOOK_DOMAIN}${
    process.env.WEBHOOK_PATH || "/webhook"
  }`;
  bot.api
    .setWebhook(webhookUrl)
    .then(() => {
      logger.info(`Bot webhook set to ${webhookUrl}`);
    })
    .catch((error) => {
      logger.error("Failed to set webhook:", error);
    });
} else {
  // Use long polling in development
  bot.start({
    onStart: () => {
      logger.info("Bot started in polling mode");
    },
  });
}

// Graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down gracefully...");
  await bot.stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export { bot, app };
export { NotificationService } from "./services/notificationService.js";
export { BotActivationService } from "./services/botActivationService.js";
