import { IconCheck, IconShoppingCartPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTransferCart } from "@/features/transfer/hooks/useTransferCart";
import type {
  ItemMasterDetail,
  ItemUnitsWithLocation,
} from "../../types/barang.types";

interface UnitCartButtonProps {
  unit: ItemUnitsWithLocation | null;
  unitId: number | null;
  item?: ItemMasterDetail;
  firstPhotoPath: string | null;
}

export function UnitCartButton({
  unit,
  unitId,
  item,
  firstPhotoPath,
}: UnitCartButtonProps) {
  const { addUnitItem, isUnitInCart } = useTransferCart();
  const alreadyInCart = unitId != null ? isUnitInCart(unitId) : false;

  const handleAddToCart = () => {
    if (!item || !unit || unitId == null) return;
    addUnitItem({
      unit_id: unit.id,
      unit_code: unit.unit_code,
      item_id: item.id,
      item_name: item.name,
      item_photo: firstPhotoPath,
      condition: unit.condition,
      location_name: unit.location.building_name,
    });
    toast.success(`Unit "${unit.unit_code}" ditambahkan ke keranjang.`);
  };

  return (
    <>
      <Button
        className="w-full rounded-sm"
        variant={alreadyInCart ? "outline" : "default"}
        onClick={handleAddToCart}
        disabled={alreadyInCart}
      >
        {alreadyInCart ? (
          <>
            <IconCheck className="h-4 w-4 mr-2" />
            Sudah di Keranjang
          </>
        ) : (
          <>
            <IconShoppingCartPlus className="h-4 w-4 mr-2" />
            Tambah ke Keranjang
          </>
        )}
      </Button>
    </>
  );
}
