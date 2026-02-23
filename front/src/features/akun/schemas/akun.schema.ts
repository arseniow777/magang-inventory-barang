import { z } from "zod";

// export const updateAccountSchema = z.object({
//   username: z
//     .string()
//     .min(3, "Username minimal 3 karakter")
//     .max(50, "Username terlalu panjang"),

//   name: z
//     .string()
//     .min(3, "Nama minimal 3 karakter")
//     .max(100, "Nama terlalu panjang"),

//   phone_number: z
//     .string()
//     .min(10, "Nomor minimal 10 digit")
//     .max(15, "Nomor maksimal 15 digit")
//     .regex(/^[0-9]+$/, "Nomor hanya boleh angka")
//     .nullable()
//     .optional(),
// });

export const updateAccountSchema = z.object({
  username: z.string().min(3).max(50),
  name: z.string().min(3).max(100),
  phone_number: z
    .string()
    .regex(/^[0-9]{8,13}$/, "Nomor hanya boleh angka, 8-13 digit")
    .nullable()
    .optional(),
});

export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;