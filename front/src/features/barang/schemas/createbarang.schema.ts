import { z } from "zod";

// File upload schema
const photoFileSchema = z
  .instanceof(File)
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    "Only JPG, JPEG, and PNG files are allowed",
  )
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB",
  );

export const createBarangSchema = z.object({
  name: z
    .string()
    .min(1, "Nama barang harus diisi")
    .min(3, "Minimal 3 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  procurement_year: z
    .number()
    .int()
    .min(1900, "Tahun tidak valid")
    .max(new Date().getFullYear() + 5, "Tahun tidak valid"),
  quantity: z
    .number()
    .int()
    .min(1, "Minimal 1 unit")
    .max(1000, "Maksimal 1000 unit"),
  location_id: z.number().int().positive("Lokasi harus dipilih"),
});

export const createBarangWithPhotosSchema = createBarangSchema.extend({
  photos: z.array(photoFileSchema).max(3, "Maksimal 3 foto"),
});

export type CreateBarangFormData = z.infer<typeof createBarangSchema>;
export type CreateBarangWithPhotosFormData = z.infer<
  typeof createBarangWithPhotosSchema
>;
