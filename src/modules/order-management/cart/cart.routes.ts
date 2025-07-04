import { RequestHandler, Router } from "express";
import { listCartItemsV100 } from "./controllers/list-cart-items.controller";
import { addToCartV100 } from "./controllers/add-to-cart.controller";
import { updateCartItemV100 } from "./controllers/update-cart-item.controller";
import {
  deleteCartBatchV100,
  deleteCartSingleV100,
} from "./controllers/delete-cart-item.controller";

const router = Router();
router.get("/", listCartItemsV100 as unknown as RequestHandler);
router.post("/", addToCartV100 as unknown as RequestHandler);
router.patch("/", updateCartItemV100 as unknown as RequestHandler);
router.delete("/:id", deleteCartSingleV100 as unknown as RequestHandler);
router.delete("/batch", deleteCartBatchV100 as unknown as RequestHandler);

export default router;
