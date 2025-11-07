import { Banner } from "../types/index.js";
/**
 * Get all active banners ordered by order_index
 * @returns Array of active banners
 */
export declare function getActiveBanners(): Promise<Banner[]>;
/**
 * Get banner by ID
 * @param bannerId - Banner ID
 * @returns Banner object or null
 */
export declare function getBannerById(bannerId: number): Promise<Banner | null>;
/**
 * Create a new banner
 * @param imageUrl - Banner image URL
 * @param link - Banner target link
 * @param orderIndex - Banner order index (optional)
 * @returns Created banner
 */
export declare function createBanner(imageUrl: string, link: string, orderIndex?: number): Promise<Banner>;
/**
 * Update banner
 * @param bannerId - Banner ID
 * @param updates - Partial banner updates
 * @returns Updated banner
 */
export declare function updateBanner(bannerId: number, updates: Partial<Omit<Banner, "id" | "created_at">>): Promise<Banner>;
/**
 * Delete banner
 * @param bannerId - Banner ID
 * @returns True if deleted successfully
 */
export declare function deleteBanner(bannerId: number): Promise<boolean>;
/**
 * Get all banners (including inactive) for admin
 * @returns Array of all banners
 */
export declare function getAllBanners(): Promise<Banner[]>;
//# sourceMappingURL=bannerService.d.ts.map