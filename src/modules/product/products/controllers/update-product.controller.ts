import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import productsTables from "@/db/schema/product-management/products/products";
import { updateProductValidationSchema } from "../products.validation";
import {
  variantProductValidationSchema,
  updateVariantProductValidationSchema,
} from "../../variant-products/variant-products.validation";
import {
  variantProductsTable,
  variantProductsMediaTables,
  stockTable,
  mediaTable,
} from "@/db/schema";
import { eq, isNull, and, ne } from "drizzle-orm";
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
    const id = req.params.id;
    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Product ID is required in the URL parameters",
      };
    }

    const { title, slug, sku, season, categoryId, brandId, isActive } =
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
    // if (sku) {
    //   const duplicateSku = await db
    //     .select()
    //     .from(productsTables)
    //     .where(eq(productsTables.sku, sku));

    //   if (
    //     duplicateSku.length > 0 &&
    //     duplicateSku[0].id !== existingProduct[0].id
    //   ) {
    //     throw {
    //       type: ERROR_TYPES.VALIDATION,
    //       message: "Product with the same SKU already exists",
    //     };
    //   }
    // }

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
    // if (brandId) {
    //   const brandExists = await db
    //     .select()
    //     .from(brandTables)
    //     .where(eq(brandTables.id, brandId));

    //   if (brandExists.length === 0) {
    //     throw {
    //       type: ERROR_TYPES.VALIDATION,
    //       message: "Brand not found",
    //     };
    //   }
    // }

    // If no variants provided, keep existing simple update behavior
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { variants } = (validation.data as any) || {};
    console.log("variants", variants);

    if (!variants) {
      // Update product only
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
    }

    // If variants provided, perform transactional update: update product, then process variants
    const result = await db.transaction(async (tx) => {
      const updatedProduct = await tx
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processedVariants: any[] = [];
      console.log("processedVariants---------", processedVariants);

      // Prepare schemas
      const newVariantSchema = variantProductValidationSchema.omit({
        productId: true,
      });

      for (const v of variants) {
        // If v has id -> update existing variant
        if (v.id) {
          const parsed = updateVariantProductValidationSchema.safeParse(v);
          if (!parsed.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errMsg = (parsed.error.errors as any[])
              .map((e) => e.message)
              .join(", ");
            throw {
              type: ERROR_TYPES.VALIDATION,
              message: errMsg,
            };
          }

          const existingVariantArr = await tx
            .select()
            .from(variantProductsTable)
            .where(eq(variantProductsTable.id, v.id));

          if (existingVariantArr.length === 0) {
            throw {
              type: ERROR_TYPES.NOT_FOUND,
              message: `Variant with id ${v.id} not found.`,
            };
          }
          const dbVariant = existingVariantArr[0];

          const hasChanges =
            (v.price !== undefined && v.price !== dbVariant.price) ||
            (v.originalPrice !== undefined &&
              v.originalPrice !== dbVariant.originalPrice) ||
            (v.description !== undefined &&
              v.description !== dbVariant.description) ||
            (v.shortDescription !== undefined &&
              v.shortDescription !== dbVariant.shortDescription) ||
            (v.bestDeal !== undefined && v.bestDeal !== dbVariant.bestDeal) ||
            (v.discountedSale !== undefined &&
              v.discountedSale !== dbVariant.discountedSale) ||
            (v.isActive !== undefined && v.isActive !== dbVariant.isActive) ||
            (v.isDeleted !== undefined &&
              v.isDeleted !== dbVariant.isDeleted) ||
            (v.colorId !== undefined && v.colorId !== dbVariant.colorId) ||
            (v.unitId !== undefined && v.unitId !== dbVariant.unitId);

          let updatedVariantData = dbVariant;

          if (hasChanges) {
            // Check for duplicate combination if relevant fields changed
            const uniquenessFieldsChanged =
              (v.colorId !== undefined && v.colorId !== dbVariant.colorId) ||
              (v.unitId !== undefined && v.unitId !== dbVariant.unitId);

            if (uniquenessFieldsChanged) {
              const dupQuery = await tx
                .select()
                .from(variantProductsTable)
                .where(
                  and(
                    eq(variantProductsTable.productId, id),
                    v.colorId
                      ? eq(variantProductsTable.colorId, v.colorId)
                      : isNull(variantProductsTable.colorId),
                    eq(variantProductsTable.unitId, v.unitId),
                    eq(variantProductsTable.isDeleted, false),
                    ne(variantProductsTable.id, v.id),
                  ),
                );

              if (dupQuery.length > 0) {
                throw {
                  type: ERROR_TYPES.VALIDATION,
                  message:
                    "A variant with the same product, color, and unit combination already exists",
                };
              }
            }

            const updatedVariant = await tx
              .update(variantProductsTable)
              .set({
                price: v.price ?? dbVariant.price,
                originalPrice: v.originalPrice ?? dbVariant.originalPrice,
                description: v.description ?? dbVariant.description,
                shortDescription:
                  v.shortDescription ?? dbVariant.shortDescription,
                bestDeal: v.bestDeal ?? dbVariant.bestDeal,
                discountedSale: v.discountedSale ?? dbVariant.discountedSale,
                isActive: v.isActive ?? dbVariant.isActive,
                isDeleted: v.isDeleted ?? dbVariant.isDeleted,
                colorId: v.colorId ?? dbVariant.colorId,
                unitId: v.unitId ?? dbVariant.unitId,
                updatedAt: new Date(),
              })
              .where(eq(variantProductsTable.id, v.id))
              .returning();
            updatedVariantData = updatedVariant[0];
          }

          // Update or insert stock if initialStock provided
          if (v.initialStock !== undefined) {
            const existingStock = await tx
              .select()
              .from(stockTable)
              .where(eq(stockTable.variantProductId, v.id))
              .limit(1);

            if (existingStock.length > 0) {
              if (existingStock[0].quantity !== v.initialStock) {
                await tx
                  .update(stockTable)
                  .set({ quantity: v.initialStock })
                  .where(eq(stockTable.variantProductId, v.id));
              }
            } else {
              await tx
                .insert(stockTable)
                .values({
                  variantProductId: v.id,
                  quantity: v.initialStock,
                  warehouseId: "257b861a-50e6-4b79-a5fd-ae87ddefc88b",
                })
                .onConflictDoNothing();
            }
          }

          // Attach media if provided
          if (v.mediaUrl) {
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
                  title: slugify(
                    String(updatedProduct[0].title || title || ""),
                    {
                      lower: true,
                      strict: true,
                    },
                  ),
                  url: v.mediaUrl,
                })
                .returning();
              mediaId = newMedia[0].id;
            }

            // Check if this media is already associated with the variant
            const existingLink = await tx
              .select()
              .from(variantProductsMediaTables)
              .where(
                and(
                  eq(variantProductsMediaTables.variantProductId, v.id),
                  eq(variantProductsMediaTables.mediaId, mediaId),
                ),
              );

            if (existingLink.length === 0) {
              await tx
                .insert(variantProductsMediaTables)
                .values({
                  variantProductId: v.id,
                  mediaId,
                })
                .onConflictDoNothing(); // onConflict is good
            }
          }

          processedVariants.push(updatedVariantData);
        } else {
          // New variant creation
          const parsed = newVariantSchema.safeParse(v);
          if (!parsed.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errMsg = (parsed.error.errors as any[])
              .map((e) => e.message)
              .join(", ");
            throw {
              type: ERROR_TYPES.VALIDATION,
              message: errMsg,
            };
          }

          // Check duplicate combination
          const existingVariant = await tx
            .select()
            .from(variantProductsTable)
            .where(
              and(
                eq(variantProductsTable.productId, id),
                v.colorId
                  ? eq(variantProductsTable.colorId, v.colorId)
                  : isNull(variantProductsTable.colorId),
                eq(variantProductsTable.unitId, v.unitId),
                eq(variantProductsTable.isDeleted, false),
              ),
            );
          console.log("existingVariant", existingVariant);

          if (existingVariant.length > 0) {
            console.log("Duplicate variant found on create>>>>>>>>>>>>>>>:");
            throw {
              type: ERROR_TYPES.VALIDATION,
              message:
                "A variant with the same product, color, and unit combination already exists",
            };
          }

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
              productId: id,
              colorId: v.colorId,
              unitId: v.unitId,
            })
            .returning();

          // create stock
          await tx
            .insert(stockTable)
            .values({
              variantProductId: newVariant[0].id,
              quantity: v.initialStock ?? 0,
              warehouseId: "257b861a-50e6-4b79-a5fd-ae87ddefc88b",
            })
            .onConflictDoNothing();

          // attach media
          if (v.mediaUrl) {
            const existingMedia = await tx
              .select()
              .from(mediaTable)
              .where(eq(mediaTable.url, v.mediaUrl));

            let mediaId;
            if (existingMedia.length > 0) mediaId = existingMedia[0].id;
            else {
              const newMedia = await tx
                .insert(mediaTable)
                .values({
                  title: slugify(
                    String(updatedProduct[0].title || title || ""),
                    {
                      lower: true,
                      strict: true,
                    },
                  ),
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

          processedVariants.push(newVariant[0]);
        }
      }

      return { product: updatedProduct[0], variants: processedVariants };
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    return handleError(error, res, PRODUCT_ENDPOINTS.UPDATE_PRODUCT);
  }
};

/**
 * Express request handler (exports as PATCH for semantic name resolution)
 */
export const PATCH = updateProductV100;
