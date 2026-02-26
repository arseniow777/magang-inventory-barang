import { Link } from "react-router-dom";
import { IconShoppingCart } from "@tabler/icons-react";
import { useCartStore } from "../store/cartStore";

export function TransferCartBadge() {
  const totalUnitCount = useCartStore((s) => s.totalUnitCount());

  return (
    <Link
      to="/dashboard/transfer"
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Keranjang transfer"
    >
      <IconShoppingCart className="h-5 w-5" />
      {totalUnitCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground leading-none">
          {totalUnitCount > 99 ? "99+" : totalUnitCount}
        </span>
      )}
    </Link>
  );
}
