import { Request, Response, NextFunction } from "express";
export interface ApiError extends Error {
    statusCode?: number;
}
export declare const errorHandler: (err: ApiError, req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map