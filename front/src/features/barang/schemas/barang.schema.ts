import { z } from "zod";

// Auth
export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(5, "Password minimal 5 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Masters
export const createItemMastersSchema = z.object({
  name: z.string().min(1, "Nama barang harus diisi"),
  model_code: z.string().min(1, "Kode model harus diisi"),
  category: z.string().min(1, "Kategori harus diisi"),
  procurement_year: z.number().int().min(1900, "Tahun tidak valid"),
});

export const updateItemMastersSchema = z.object({
  name: z.string().min(1, "Nama barang harus diisi").optional(),
  model_code: z.string().min(1, "Kode model harus diisi").optional(),
  category: z.string().min(1, "Kategori harus diisi").optional(),
  procurement_year: z.number().int().min(1900, "Tahun tidak valid").optional(),
});

export type CreateItemMastersFormData = z.infer<typeof createItemMastersSchema>;
export type UpdateItemMastersFormData = z.infer<typeof updateItemMastersSchema>;

// Units
export const itemConditionEnum = z.enum(["good", "damaged", "broken"]);
export const itemStatusEnum = z.enum([
  "available",
  "borrowed",
  "transferred",
  "sold",
  "demolished",
]);

export const createItemUnitsSchema = z.object({
  unit_code: z.string().min(1, "Kode unit harus diisi"),
  condition: itemConditionEnum.default("good"),
  status: itemStatusEnum.default("available"),
  item_id: z.number().int().positive("Item ID tidak valid"),
  location_id: z.number().int().positive("Lokasi harus dipilih"),
});

export const updateItemUnitsSchema = z.object({
  unit_code: z.string().min(1, "Kode unit harus diisi").optional(),
  condition: itemConditionEnum.optional(),
  status: itemStatusEnum.optional(),
  item_id: z.number().int().positive("Item ID tidak valid").optional(),
  location_id: z.number().int().positive("Lokasi harus dipilih").optional(),
});

export type CreateItemUnitsFormData = z.infer<typeof createItemUnitsSchema>;
export type UpdateItemUnitsFormData = z.infer<typeof updateItemUnitsSchema>;

// photos
export const createItemPhotosSchema = z.object({
  file_path: z.string().min(1, "File path harus diisi"),
  item_id: z.number().int().positive("Item harus dipilih"),
});

export type CreateItemPhotosFormData = z.infer<typeof createItemPhotosSchema>;
