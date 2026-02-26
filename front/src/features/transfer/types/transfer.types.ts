import type { Location } from "@/features/barang/types/createbarang.types";

export type { Location };

export type ReportType = "borrow" | "transfer" | "sell" | "demolish";

/** Types that require a destination_location_id */
export const TYPES_WITH_DESTINATION: ReportType[] = ["borrow", "transfer"];

// ── Cart item variants ────────────────────────────────────────────────────────

/** A specific unit added from ItemUnitDetail */
export interface UnitCartItem {
  type: "unit";
  unit_id: number;
  unit_code: string;
  item_id: number;
  item_name: string;
  item_photo: string | null;
  condition: "good" | "damaged" | "broken";
  location_name: string;
}

/** An item added by quantity from ItemDetail — system auto-picks available units */
export interface QuantityCartItem {
  type: "quantity";
  item_id: number;
  item_name: string;
  item_photo: string | null;
  quantity: number;
}

export type CartItem = UnitCartItem | QuantityCartItem;

// ── Payload for POST /requests ────────────────────────────────────────────────

export type TransferItemPayload =
  | { unit_id: number }
  | { item_id: number; quantity: number };

export interface TransferRequestPayload {
  request_type: ReportType;
  destination_location_id?: number;
  reason: string;
  items: TransferItemPayload[];
}

// ── Form values ───────────────────────────────────────────────────────────────

export interface TransferFormValues {
  request_type: ReportType;
  destination_location_id?: number;
  reason: string;
}
