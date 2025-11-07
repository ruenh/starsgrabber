export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}
export interface TelegramInitData {
    query_id?: string;
    user?: TelegramUser;
    auth_date: number;
    hash: string;
}
export interface JWTPayload {
    userId: number;
    telegramId: number;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
//# sourceMappingURL=auth.d.ts.map