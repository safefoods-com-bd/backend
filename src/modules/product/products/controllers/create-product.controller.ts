import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import { productValidationSchema } from "../products.validation";
import { variantProductValidationSchema } from "../../variant-products/variant-products.validation";
import {
  variantProductsTable,
  variantProductsMediaTables,
  stockTable,
  mediaTable,
} from "@/db/schema";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { variants } = validation.data as any;

    // Validate variants: must be an array with at least one variant
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "At least one variant is required",
      };
    }

    // Validate each variant using variantProductValidationSchema but allow productId to be omitted
    const variantSchema = variantProductValidationSchema.omit({
      productId: true,
    });
    for (const v of variants) {
      const vRes = variantSchema.safeParse(v);
      if (!vRes.success) {
        throw {
          type: ERROR_TYPES.VALIDATION,
          message: vRes.error.errors.map((err) => err.message).join(", "),
        };
      }
    }

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

    // Create product and variants inside a transaction
    const result = await db.transaction(async (tx) => {
      const newProduct = await tx
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createdVariants: any[] = [];

      for (const v of variants) {
        // create variant with productId set to the newly created product
        const newVariant = await tx
          .insert(variantProductsTable)
          .values({
            price: v.price,
            originalPrice: v.originalPrice,
            description: v.description,
            shortDescription: v.shortDescription,
            bestDeal: v.bestDeal !== undefined ? v.bestDeal : false,
            discountedSale:
              v.discountedSale !== undefined ? v.discountedSale : false,
            isActive: v.isActive !== undefined ? v.isActive : true,
            productId: newProduct[0].id,
            colorId: v.colorId,
            unitId: v.unitId,
          })
          .returning();

        createdVariants.push(newVariant[0]);

        // attach media if mediaUrl provided (create media if not exists)
        if (v.mediaUrl) {
          // find existing media
          const existingMedia = await tx
            .select()
            .from(mediaTable)
            .where(eq(mediaTable.url, v.mediaUrl));

          let mediaId;
          if (existingMedia.length > 0) {
            mediaId = existingMedia[0].id;
          } else {
            const newMedia = await tx
              .insert(mediaTable)
              .values({
                title: slugify(title, { lower: true, strict: true }),
                url: v.mediaUrl,
              })
              .returning();
            mediaId = newMedia[0].id;
          }

          await tx
            .insert(variantProductsMediaTables)
            .values({
              variantProductId: newVariant[0].id,
              mediaId,
            })
            .onConflictDoNothing();
        }

        // create stock record (use default warehouse id as in seed)
        await tx
          .insert(stockTable)
          .values({
            variantProductId: newVariant[0].id,
            quantity: v.initialStock ?? 0,
            warehouseId: "257b861a-50e6-4b79-a5fd-ae87ddefc88b",
          })
          .onConflictDoNothing();
      }

      return { product: newProduct[0], variants: createdVariants };
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.CREATE_PRODUCT);
  }
};
