import type { ItemCondition, ItemStatus } from "../types/barang.types";

// ── Condition ────────────────────────────────────────────────────────────────

export const conditionLabel: Record<ItemCondition, string> = {
  good: "Baik",
  damaged: "Rusak Ringan",
  broken: "Rusak Berat",
};

export const conditionVariant: Record<
  ItemCondition,
  "default" | "secondary" | "destructive" | "outline"
> = {
  good: "default",
  damaged: "secondary",
  broken: "destructive",
};

// ── Status ───────────────────────────────────────────────────────────────────

export const statusLabel: Record<ItemStatus, string> = {
  available: "Tersedia",
  borrowed: "Dipinjam",
  transferred: "Dipindah",
  sold: "Dijual",
  demolished: "Dimusnahkan",
};

export const statusVariant: Record<
  ItemStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  available: "default",
  borrowed: "secondary",
  transferred: "outline",
  sold: "outline",
  demolished: "destructive",
};

// ── Audit action ─────────────────────────────────────────────────────────────

export const actionVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  APPROVE: "default",
  REJECT: "destructive",
};
