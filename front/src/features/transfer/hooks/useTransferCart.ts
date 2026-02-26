import { useCartStore, getCartItemKey } from "../store/cartStore";
import type { UnitCartItem, QuantityCartItem } from "../types/transfer.types";

/**
 * Convenience wrapper over the Zustand cart store.
 * Use this hook in components instead of importing the store directly.
 */
export function useTransferCart() {
  const items = useCartStore((s) => s.items);
  const addUnitItem = useCartStore((s) => s.addUnitItem);
  const addQuantityItem = useCartStore((s) => s.addQuantityItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalUnitCount = useCartStore((s) => s.totalUnitCount);
  const isUnitInCart = useCartStore((s) => s.isUnitInCart);

  return {
    items,
    addUnitItem: (item: Omit<UnitCartItem, "type">) => addUnitItem(item),
    addQuantityItem: (item: Omit<QuantityCartItem, "type">) =>
      addQuantityItem(item),
    removeItem,
    updateQuantity,
    clearCart,
    totalUnitCount: totalUnitCount(),
    isUnitInCart,
    getKey: getCartItemKey,
  };
}
