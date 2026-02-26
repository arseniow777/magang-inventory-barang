import { apiClient } from "@/lib/api";
import type { CartItem, TransferFormValues } from "../types/transfer.types";
import type {
  TransferRequestPayload,
  TransferItemPayload,
} from "../types/transfer.types";

// ── helpers ───────────────────────────────────────────────────────────────────

function buildPayload(
  cartItems: CartItem[],
  values: TransferFormValues,
): TransferRequestPayload {
  const payload: TransferRequestPayload = {
    request_type: values.request_type,
    reason: values.reason,
    items: cartItems.map(
      (item): TransferItemPayload =>
        item.type === "unit"
          ? { unit_id: item.unit_id }
          : { item_id: item.item_id, quantity: item.quantity },
    ),
  };

  if (values.destination_location_id) {
    payload.destination_location_id = values.destination_location_id;
  }

  return payload;
}

// ── API ───────────────────────────────────────────────────────────────────────

export const transferAPI = {
  /** POST /requests — creates a request from cart items */
  createRequest: (cartItems: CartItem[], values: TransferFormValues) =>
    apiClient.post<{ id: number; request_code: string }>(
      "/requests",
      buildPayload(cartItems, values),
    ),
};
