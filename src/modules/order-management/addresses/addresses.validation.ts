import { z } from "zod";

export const addressValidationSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .uuid("Invalid user ID format"),
  flatNo: z
    .string()
    .min(1, "Flat number cannot be empty")
    .max(100, "Flat number too long")
    .optional(),
  floorNo: z
    .string()
    .min(1, "Floor number cannot be empty")
    .max(100, "Floor number too long")
    .optional(),
  addressLine: z
    .string({
      required_error: "Address line is required",
    })
    .min(1, "Address line cannot be empty")
    .max(500, "Address line too long"),
  name: z.string().min(1, "Name cannot be empty").max(100, "Name too long"),
  phoneNo: z
    .string({ required_error: "Phone number is required" })
    .min(11, "Phone number must be at least 11 characters long"),
  deliveryNotes: z.string().optional(),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City cannot be empty")
    .max(100, "City name too long"),
  state: z.string().optional(),
  country: z.string().default("Bangladesh"),
  postalCode: z
    .string()
    .min(1, "Postal code cannot be empty")
    .max(20, "Postal code too long")
    .optional(),
  isActive: z.boolean().default(false),
});

export type AddressValidationType = z.infer<typeof addressValidationSchema>;

export const updateAddressValidationSchema = addressValidationSchema
  .partial()
  .extend({
    id: z
      .string({ required_error: "Address ID is required" })
      .uuid("Invalid ID format"),
  });

export type UpdateAddressValidationType = z.infer<
  typeof updateAddressValidationSchema
>;

export const deleteAddressValidationSchema = z.object({
  id: z
    .string({ required_error: "Address ID is required" })
    .uuid("Invalid ID format"),
});

export type DeleteAddressValidationType = z.infer<
  typeof deleteAddressValidationSchema
>;

export const deleteAddressesBatchValidationSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one address ID is required"),
});

export type DeleteAddressesBatchValidationType = z.infer<
  typeof deleteAddressesBatchValidationSchema
>;

export const getUserAddressesValidationSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .uuid("Invalid user ID format"),
});

export type GetUserAddressesValidationType = z.infer<
  typeof getUserAddressesValidationSchema
>;
