import { Separator } from "@/components/ui/separator";
import { IconShoppingCart } from "@tabler/icons-react";
import { useTransferCart } from "../hooks/useTransferCart";
import { CartItemRow } from "./CartItemRow";

export function TransferCartSummary() {
  const { items, totalUnitCount } = useTransferCart();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <IconShoppingCart className="h-4 w-4 text-muted-foreground" />
        <p className="font-semibold text-sm">
          Keranjang Transfer{" "}
          <span className="text-muted-foreground font-normal">
            ({items.length} item · {totalUnitCount} unit)
          </span>
        </p>
      </div>

      <Separator />

      {/* Item list */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItemRow
            key={
              item.type === "unit"
                ? `unit-${item.unit_id}`
                : `qty-${item.item_id}`
            }
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
