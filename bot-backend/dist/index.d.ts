import { Bot } from "grammy";
declare const app: import("express-serve-static-core").Express;
declare const bot: Bot<import("grammy").Context, import("grammy").Api<import("grammy").RawApi>>;
export { bot, app };
export { NotificationService } from "./services/notificationService.js";
export { BotActivationService } from "./services/botActivationService.js";
//# sourceMappingURL=index.d.ts.map