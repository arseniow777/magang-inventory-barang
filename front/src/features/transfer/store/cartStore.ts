import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  UnitCartItem,
  QuantityCartItem,
} from "../types/transfer.types";

// ── helpers ───────────────────────────────────────────────────────────────────

export function getCartItemKey(item: CartItem): string {
  return item.type === "unit" ? `unit-${item.unit_id}` : `qty-${item.item_id}`;
}

// ── store ─────────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];

  /** Add a specific unit (from ItemUnitDetail). Duplicate unit_id is ignored. */
  addUnitItem: (item: Omit<UnitCartItem, "type">) => void;

  /** Add an item by quantity (from ItemDetail). Updates quantity if already in cart. */
  addQuantityItem: (item: Omit<QuantityCartItem, "type">) => void;

  /** Remove an item by its cart key (`unit-{id}` or `qty-{id}`). */
  removeItem: (key: string) => void;

  /** Update the quantity of a QuantityCartItem. */
  updateQuantity: (item_id: number, quantity: number) => void;

  /** Clear all items. */
  clearCart: () => void;

  /** Total number of units in cart (qty items sum their quantity). */
  totalUnitCount: () => number;

  /** Check whether a specific unit_id is already in the cart. */
  isUnitInCart: (unit_id: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addUnitItem: (item) =>
        set((state) => {
          const alreadyIn = state.items.some(
            (i) => i.type === "unit" && i.unit_id === item.unit_id,
          );
          if (alreadyIn) return state;
          return {
            items: [...state.items, { ...item, type: "unit" as const }],
          };
        }),

      addQuantityItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.type === "quantity" && i.item_id === item.item_id,
          );
          if (idx !== -1) {
            const updated = [...state.items];
            updated[idx] = {
              ...(updated[idx] as QuantityCartItem),
              quantity: item.quantity,
            };
            return { items: updated };
          }
          return {
            items: [...state.items, { ...item, type: "quantity" as const }],
          };
        }),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => getCartItemKey(i) !== key),
        })),

      updateQuantity: (item_id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.type === "quantity" && i.item_id === item_id
              ? { ...i, quantity }
              : i,
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalUnitCount: () =>
        get().items.reduce(
          (acc, i) => acc + (i.type === "unit" ? 1 : i.quantity),
          0,
        ),

      isUnitInCart: (unit_id) =>
        get().items.some((i) => i.type === "unit" && i.unit_id === unit_id),
    }),
    { name: "transfer-cart" },
  ),
);
