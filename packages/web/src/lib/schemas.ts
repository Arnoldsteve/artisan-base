// In packages/web/src/lib/schemas.ts
import * as z from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 characters long."),
  id: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Must be lowercase alphanumeric with dashes."
    ),
});

// export const createProductSchema = z.object({
//   name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
//   description: z.string().optional(),
//   price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
//   // This is the fix: it allows a valid URL OR an empty string
//   imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
// });


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createProductSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  
  // The image field is now for a FileList
  image: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});
