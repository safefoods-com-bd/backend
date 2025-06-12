import variantProductsRoutes from "./variant-products.routes";
import { listAllVariantProductsV100 } from "./controllers/list-all-variant-products.controller";
import { getSingleVariantProductV100 } from "./controllers/get-single-variant-product.controller";
import { getVariantProductsByProductV100 } from "./controllers/get-variants-by-product.controller";
import { createVariantProductV100 } from "./controllers/create-variant-product.controller";
import { updateVariantProductV100 } from "./controllers/update-variant-product.controller";
import {
  deleteVariantProductSingleV100,
  deleteVariantProductBatchV100,
} from "./controllers/delete-variant-product.controller";
import {
  variantProductValidationSchema,
  updateVariantProductValidationSchema,
  deleteVariantProductValidationSchema,
  batchDeleteVariantProductValidationSchema,
} from "./variant-products.validation";

export {
  variantProductsRoutes,
  listAllVariantProductsV100,
  getSingleVariantProductV100,
  getVariantProductsByProductV100,
  createVariantProductV100,
  updateVariantProductV100,
  deleteVariantProductSingleV100,
  deleteVariantProductBatchV100,
  variantProductValidationSchema,
  updateVariantProductValidationSchema,
  deleteVariantProductValidationSchema,
  batchDeleteVariantProductValidationSchema,
};
