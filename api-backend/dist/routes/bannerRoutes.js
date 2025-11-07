import { Router } from "express";
import { getBanners } from "../controllers/bannerController.js";
const router = Router();
// GET /api/banners - Get all active banners (public endpoint)
router.get("/", getBanners);
export default router;
//# sourceMappingURL=bannerRoutes.js.map