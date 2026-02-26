import { z } from "zod";

export const reportTypeEnum = z.enum([
  "borrow",
  "transfer",
  "sell",
  "demolish",
]);

export const transferFormSchema = z
  .object({
    request_type: reportTypeEnum,

    destination_location_id: z.coerce.number().optional(),

    reason: z.string().min(5, "Alasan minimal 5 karakter"),
  })
  .superRefine((data, ctx) => {
    const needsDest =
      data.request_type === "borrow" || data.request_type === "transfer";
    if (
      needsDest &&
      (!data.destination_location_id || data.destination_location_id <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination_location_id"],
        message: "Lokasi tujuan wajib dipilih untuk tipe ini",
      });
    }
  });

export type TransferFormValues = z.infer<typeof transferFormSchema>;
