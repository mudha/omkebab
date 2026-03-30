import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const createTransactionSchema = z.object({
  branchId: z.string().min(1, "Cabang wajib dipilih"),
  salesMethod: z.enum(["OFFLINE", "SHOPEEFOOD", "GRABFOOD"] as const, {
    message: "Metode penjualan tidak valid",
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Produk tidak valid"),
        quantity: z.number().int().min(1, "Jumlah minimal 1"),
      })
    )
    .min(1, "Transaksi tidak boleh kosong"),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z.number().int().min(0, "Harga tidak valid"),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const transactionFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchId: z.string().optional(),
  salesMethod: z.enum(["OFFLINE", "SHOPEEFOOD", "GRABFOOD"] as const).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
