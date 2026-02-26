import {
  IconTrash,
  IconMinus,
  IconPlus,
  IconBoxSeam,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/config/api";
import { useTransferCart } from "../hooks/useTransferCart";
import type { CartItem } from "../types/transfer.types";
import { getCartItemKey } from "../store/cartStore";
import {
  conditionLabel,
  conditionVariant,
} from "@/features/barang/components/item-badge-helpers";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { removeItem, updateQuantity } = useTransferCart();
  const key = getCartItemKey(item);

  const imageUrl = item.item_photo ? getImageUrl(item.item_photo) : null;

  const handleRemove = () => removeItem(key);

  const handleDecrement = () => {
    if (item.type === "quantity") {
      if (item.quantity <= 1) {
        removeItem(key);
      } else {
        updateQuantity(item.item_id, item.quantity - 1);
      }
    }
  };

  const handleIncrement = () => {
    if (item.type === "quantity") {
      updateQuantity(item.item_id, item.quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-accent/30 px-4 py-3">
      {/* Thumbnail */}
      <div className="h-14 w-14 shrink-0 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.item_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <IconBoxSeam className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-snug truncate">
          {item.item_name}
        </p>

        {item.type === "unit" ? (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">
              {item.unit_code}
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-xs text-muted-foreground">
              {item.location_name}
            </span>
            <Badge
              variant={conditionVariant[item.condition]}
              className="text-[10px] h-4 px-1.5"
            >
              {conditionLabel[item.condition]}
            </Badge>
          </div>
        ) : (
          /* Quantity stepper */
          <div className="flex items-center gap-1 mt-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={handleDecrement}
            >
              <IconMinus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={handleIncrement}
            >
              <IconPlus className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground ml-1">unit</span>
          </div>
        )}
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleRemove}
      >
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  );
}
