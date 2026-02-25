import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100),
  employee_id: z.string().min(3, "ID Karyawan minimal 3 karakter").max(50),
  username: z.string().min(3, "Username minimal 3 karakter").max(50),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["pic", "admin"]),
  phone_number: z
    .string()
    .regex(/^[0-9]{8,13}$/, "Nomor hanya boleh angka, 8-13 digit")
    .nullable()
    .optional(),
  telegram_id: z.string().nullable().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
