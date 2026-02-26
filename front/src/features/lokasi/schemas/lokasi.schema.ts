// import { z } from "zod";

// export const createLokasiSchema = z.object({
//   building_name: z.string().min(3, "Nama gedung minimal 3 karakter").max(100),
//   floor: z
//     .number({ error: "Lantai harus berupa angka" })
//     .int()
//     .min(1, "Lantai minimal 1"),
//   address: z.string().min(5, "Alamat minimal 5 karakter"),
// });

// export type CreateLokasiFormData = z.infer<typeof createLokasiSchema>;

import { z } from "zod";

export const createLokasiSchema = z.object({
  building_name: z.string().min(3, "Nama gedung minimal 3 karakter").max(100),
  floor: z
    .number({ error: "Lantai harus berupa angka" })
    .int()
    .min(1, "Lantai minimal 1"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
});

export const updateLokasiSchema = z.object({
  building_name: z
    .string()
    .min(3, "Nama gedung minimal 3 karakter")
    .max(100)
    .optional(),
  floor: z
    .number({ error: "Lantai harus berupa angka" })
    .int()
    .min(1, "Lantai minimal 1")
    .optional(),
  address: z.string().min(5, "Alamat minimal 5 karakter").optional(),
});

export type CreateLokasiFormData = z.infer<typeof createLokasiSchema>;
export type UpdateLokasiFormData = z.infer<typeof updateLokasiSchema>;
