import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import { updateProductValidationSchema } from "../products.validation";
import { eq } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";
import slugify from "slugify";

/**
 * Updates an existing product record in the database
 *
 * @async
 * @function updateProductV100
 * @param {Request} req - Express request object containing product data in the body with id
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated product data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if product with provided id does not exist
 *
 * @description
 * This controller handles PATCH requests to update product records.
 * It validates the incoming request body against updateProductValidationSchema.
 * If validation passes, it updates the product record with the provided data.
 * Returns a 200 status with the updated product record on success.
 */
export const updateProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = updateProductValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { id, title, slug, sku, season, categoryId, brandId, isActive } =
      validation.data;

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(productsTables)
      .where(eq(productsTables.id, id));

    if (existingProduct.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Product not found",
      };
    }

    // Check if the SKU exists (if SKU update is requested) and it's different from current product
    if (sku) {
      const duplicateSku = await db
        .select()
        .from(productsTables)
        .where(eq(productsTables.sku, sku));

      if (
        duplicateSku.length > 0 &&
        duplicateSku[0].id !== existingProduct[0].id
      ) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: "Product with the same SKU already exists",
        };
      }
    }

    // Check if the category exists (if categoryId is provided)
    if (categoryId) {
      const categoryExists = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, categoryId));

      if (categoryExists.length === 0) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: "Category not found",
        };
      }
    }

    // Check if the brand exists (if brandId is provided)
    if (brandId) {
      const brandExists = await db
        .select()
        .from(brandTables)
        .where(eq(brandTables.id, brandId));

      if (brandExists.length === 0) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: "Brand not found",
        };
      }
    }

    // Update product
    const updatedProduct = await db
      .update(productsTables)
      .set({
        title: title || existingProduct[0].title,
        slug:
          slug ||
          (title
            ? slugify(title, { lower: true, strict: true })
            : existingProduct[0].slug),
        sku: sku || existingProduct[0].sku,
        season: season || existingProduct[0].season,
        categoryId: categoryId || existingProduct[0].categoryId,
        brandId: brandId || existingProduct[0].brandId,
        isActive:
          isActive !== undefined ? isActive : existingProduct[0].isActive,
        updatedAt: new Date(),
      })
      .where(eq(productsTables.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct[0],
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.UPDATE_PRODUCT);
  }
};

/**
 * Express request handler (exports as PATCH for semantic name resolution)
 */
export const PATCH = updateProductV100;
