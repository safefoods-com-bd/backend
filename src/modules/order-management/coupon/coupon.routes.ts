import { RequestHandler, Router } from "express";
import { getCouponsV100 } from "./controllers/get-coupon.controller";
import { createCouponV100 } from "./controllers/create-coupon.controller";
import { updateCouponV100 } from "./controllers/update-coupon.controller";
import { validateCouponV100 } from "./controllers/validate-coupon.controller";
// import { deleteCouponV100 } from "./controllers/delete-coupon.controller";

const router = Router();

// Get all coupons
router.get("/", getCouponsV100 as RequestHandler);

// Create a new coupon
router.post("/", createCouponV100 as RequestHandler);

router.post("/validate", validateCouponV100 as RequestHandler);
// Update an existing coupon
router.patch("/:id", updateCouponV100 as RequestHandler);

// Validate a coupon
// Uncomment the following line when the validateCouponV100 controller is implemented

// Delete a single coupon
//   router.delete("/", deleteCouponV100 as RequestHandler);

// Delete multiple coupons
//   router.delete("/batch", deleteCouponsBatchV100 as RequestHandler);

export default router;
