import crypto from "crypto";
/**
 * Validates Telegram initData signature
 * @param initData - The initData string from Telegram Mini App
 * @param botToken - The bot token
 * @returns boolean indicating if the signature is valid
 */
export function validateTelegramInitData(initData, botToken) {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get("hash");
        if (!hash) {
            return false;
        }
        // Remove hash from params
        urlParams.delete("hash");
        // Sort params alphabetically and create data-check-string
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join("\n");
        // Create secret key using HMAC-SHA256 with "WebAppData" constant
        const secretKey = crypto
            .createHmac("sha256", "WebAppData")
            .update(botToken)
            .digest();
        // Calculate hash using HMAC-SHA256 with secret key
        const calculatedHash = crypto
            .createHmac("sha256", secretKey)
            .update(dataCheckString)
            .digest("hex");
        return calculatedHash === hash;
    }
    catch (error) {
        return false;
    }
}
/**
 * Parses Telegram initData string into structured object
 * @param initData - The initData string from Telegram Mini App
 * @returns Parsed TelegramInitData object
 */
export function parseTelegramInitData(initData) {
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get("user");
    const authDate = urlParams.get("auth_date");
    const hash = urlParams.get("hash");
    if (!authDate || !hash) {
        throw new Error("Invalid initData: missing required fields");
    }
    const result = {
        auth_date: parseInt(authDate, 10),
        hash,
    };
    if (userStr) {
        result.user = JSON.parse(decodeURIComponent(userStr));
    }
    const queryId = urlParams.get("query_id");
    if (queryId) {
        result.query_id = queryId;
    }
    return result;
}
/**
 * Checks if initData is expired (older than 24 hours)
 * @param authDate - The auth_date from initData
 * @returns boolean indicating if the data is expired
 */
export function isInitDataExpired(authDate) {
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = 24 * 60 * 60; // 24 hours in seconds
    return currentTime - authDate > expirationTime;
}
//# sourceMappingURL=telegram.js.map