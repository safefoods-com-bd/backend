import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import { productValidationSchema } from "../products.validation";
import { eq } from "drizzle-orm";
import { PRODUCT_ENDPOINTS } from "@/data/endpoints";
import categoriesTable from "@/db/schema/product-management/categories/categories";
import brandTables from "@/db/schema/utils/brands";
import slugify from "slugify";

/**
 * Creates a new product record in the database
 *
 * @async
 * @function createProductV100
 * @param {Request} req - Express request object containing product data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the created product data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 *
 * @description
 * This controller handles POST requests to create new product records.
 * It validates the incoming request body against productValidationSchema.
 * If validation passes, it creates a new product record with the provided details.
 * Returns a 201 status with the created product record on success.
 */
export const createProductV100 = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Validate input
    const validation = productValidationSchema.safeParse(req.body);

    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { title, sku, season, categoryId, brandId, isActive, slug } =
      validation.data;

    // Check for existing product with same SKU
    const existingProductBySKU = await db
      .select()
      .from(productsTables)
      .where(eq(productsTables.sku, sku));

    if (existingProductBySKU.length > 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Product with the same SKU already exists",
      };
    }

    // Check if the category exists
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

    // Check if the brand exists
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

    // Create product record
    const newProduct = await db
      .insert(productsTables)
      .values({
        title,
        slug: !slug ? slugify(title, { lower: true, strict: true }) : slug,
        sku,
        season,
        categoryId,
        brandId,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct[0],
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.CREATE_PRODUCT);
  }
};
