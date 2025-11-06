import { Request, Response } from "express";
import {
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
} from "../services/bannerService.js";
import logger from "../utils/logger.js";

/**
 * Get all active banners
 * GET /api/banners
 */
export async function getBanners(_req: Request, res: Response) {
  try {
    const banners = await getActiveBanners();

    return res.status(200).json({ banners });
  } catch (error) {
    logger.error("Error getting banners", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to fetch banners",
      statusCode: 500,
    });
  }
}

/**
 * Create a new banner (Admin only)
 * POST /api/admin/banners
 */
export async function createBannerAdmin(req: Request, res: Response) {
  try {
    const { imageUrl, link, orderIndex } = req.body;

    // Validate required fields
    if (!imageUrl || !link) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Missing required fields: imageUrl, link",
        statusCode: 400,
      });
    }

    // Validate URL formats
    try {
      new URL(imageUrl);
      new URL(link);
    } catch {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid URL format for imageUrl or link",
        statusCode: 400,
      });
    }

    const banner = await createBanner(imageUrl, link, orderIndex);

    return res.status(201).json({ banner });
  } catch (error) {
    logger.error("Error creating banner", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to create banner",
      statusCode: 500,
    });
  }
}

/**
 * Update banner (Admin only)
 * PUT /api/admin/banners/:id
 */
export async function updateBannerAdmin(req: Request, res: Response) {
  try {
    const bannerId = parseInt(req.params.id);
    const { imageUrl, link, orderIndex, active } = req.body;

    if (isNaN(bannerId)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid banner ID",
        statusCode: 400,
      });
    }

    // Validate URL formats if provided
    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        return res.status(400).json({
          error: "BadRequest",
          message: "Invalid URL format for imageUrl",
          statusCode: 400,
        });
      }
    }

    if (link) {
      try {
        new URL(link);
      } catch {
        return res.status(400).json({
          error: "BadRequest",
          message: "Invalid URL format for link",
          statusCode: 400,
        });
      }
    }

    const updates: any = {};
    if (imageUrl !== undefined) updates.image_url = imageUrl;
    if (link !== undefined) updates.link = link;
    if (orderIndex !== undefined) updates.order_index = orderIndex;
    if (active !== undefined) updates.active = active;

    const banner = await updateBanner(bannerId, updates);

    return res.status(200).json({ banner });
  } catch (error) {
    logger.error("Error updating banner", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to update banner",
      statusCode: 500,
    });
  }
}

/**
 * Delete banner (Admin only)
 * DELETE /api/admin/banners/:id
 */
export async function deleteBannerAdmin(req: Request, res: Response) {
  try {
    const bannerId = parseInt(req.params.id);

    if (isNaN(bannerId)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid banner ID",
        statusCode: 400,
      });
    }

    await deleteBanner(bannerId);

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting banner", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to delete banner",
      statusCode: 500,
    });
  }
}

/**
 * Get all banners including inactive (Admin only)
 * GET /api/admin/banners
 */
export async function getAllBannersAdmin(_req: Request, res: Response) {
  try {
    const banners = await getAllBanners();

    return res.status(200).json({ banners });
  } catch (error) {
    logger.error("Error getting all banners", { error });
    return res.status(500).json({
      error: "ServerError",
      message: "Failed to fetch banners",
      statusCode: 500,
    });
  }
}
