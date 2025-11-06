import { supabase } from "../config/supabase.js";
import { Banner } from "../types/index.js";
import logger from "../utils/logger.js";

/**
 * Get all active banners ordered by order_index
 * @returns Array of active banners
 */
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error("Error getting active banners", { error });
    throw error;
  }
}

/**
 * Get banner by ID
 * @param bannerId - Banner ID
 * @returns Banner object or null
 */
export async function getBannerById(bannerId: number): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("id", bannerId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    logger.error("Error getting banner by ID", { bannerId, error });
    throw error;
  }
}

/**
 * Create a new banner
 * @param imageUrl - Banner image URL
 * @param link - Banner target link
 * @param orderIndex - Banner order index (optional)
 * @returns Created banner
 */
export async function createBanner(
  imageUrl: string,
  link: string,
  orderIndex?: number
): Promise<Banner> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .insert({
        image_url: imageUrl,
        link: link,
        order_index: orderIndex ?? 0,
        active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Banner created", { bannerId: data.id });
    return data;
  } catch (error) {
    logger.error("Error creating banner", { error });
    throw error;
  }
}

/**
 * Update banner
 * @param bannerId - Banner ID
 * @param updates - Partial banner updates
 * @returns Updated banner
 */
export async function updateBanner(
  bannerId: number,
  updates: Partial<Omit<Banner, "id" | "created_at">>
): Promise<Banner> {
  try {
    const updateData: any = {};

    if (updates.image_url !== undefined)
      updateData.image_url = updates.image_url;
    if (updates.link !== undefined) updateData.link = updates.link;
    if (updates.order_index !== undefined)
      updateData.order_index = updates.order_index;
    if (updates.active !== undefined) updateData.active = updates.active;

    const { data, error } = await supabase
      .from("banners")
      .update(updateData)
      .eq("id", bannerId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("Banner updated", { bannerId });
    return data;
  } catch (error) {
    logger.error("Error updating banner", { bannerId, error });
    throw error;
  }
}

/**
 * Delete banner
 * @param bannerId - Banner ID
 * @returns True if deleted successfully
 */
export async function deleteBanner(bannerId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", bannerId);

    if (error) {
      throw error;
    }

    logger.info("Banner deleted", { bannerId });
    return true;
  } catch (error) {
    logger.error("Error deleting banner", { bannerId, error });
    throw error;
  }
}

/**
 * Get all banners (including inactive) for admin
 * @returns Array of all banners
 */
export async function getAllBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error("Error getting all banners", { error });
    throw error;
  }
}
