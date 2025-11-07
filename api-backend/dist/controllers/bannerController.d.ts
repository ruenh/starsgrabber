import { Request, Response } from "express";
/**
 * Get all active banners
 * GET /api/banners
 */
export declare function getBanners(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Create a new banner (Admin only)
 * POST /api/admin/banners
 */
export declare function createBannerAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Update banner (Admin only)
 * PUT /api/admin/banners/:id
 */
export declare function updateBannerAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Delete banner (Admin only)
 * DELETE /api/admin/banners/:id
 */
export declare function deleteBannerAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Get all banners including inactive (Admin only)
 * GET /api/admin/banners
 */
export declare function getAllBannersAdmin(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=bannerController.d.ts.map