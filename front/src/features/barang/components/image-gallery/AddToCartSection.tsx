import { useState } from "react";
import { IconMinus, IconPlus, IconShoppingCartPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTransferCart } from "@/features/transfer/hooks/useTransferCart";
import { useAuthUser, Role } from "@/hooks/useAuthUser";

interface AddToCartSectionProps {
  itemId: number;
  itemName: string;
  firstPhotoPath: string | null;
  availableUnits: number;
}

export function AddToCartSection({
  itemId,
  itemName,
  firstPhotoPath,
  availableUnits,
}: AddToCartSectionProps) {
  const [addQty, setAddQty] = useState(1);
  const { addQuantityItem } = useTransferCart();
  const { data: authUser } = useAuthUser();

  if (authUser?.role !== Role.pic) return null;

  const handleAddToCart = () => {
    addQuantityItem({
      item_id: itemId,
      item_name: itemName,
      item_photo: firstPhotoPath,
      quantity: addQty,
    });
    toast.success(`${addQty} unit "${itemName}" ditambahkan ke keranjang.`);
    setAddQty(1);
  };

  return (
    <>
      <Separator />
      <div className="space-y-5">
        <p className="text-sm font-semibold">Tambah ke Keranjang</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setAddQty((q) => Math.max(1, q - 1))}
              disabled={addQty <= 1}
            >
              <IconMinus className="h-3.5 w-3.5" />
            </Button>
            <Input
              type="number"
              min={1}
              max={availableUnits}
              value={addQty}
              onChange={(e) =>
                setAddQty(
                  Math.min(
                    availableUnits,
                    Math.max(1, Number(e.target.value) || 1),
                  ),
                )
              }
              className="w-full text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setAddQty((q) => Math.min(availableUnits, q + 1))}
              disabled={addQty >= availableUnits}
            >
              <IconPlus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            maks {availableUnits} unit tersedia
          </p>
        </div>
        <Button className="w-full mb-5" onClick={handleAddToCart}>
          <IconShoppingCartPlus size="lg" className="h-4 w-4 mr-2" />
          Tambah ke Keranjang
        </Button>
      </div>
    </>
  );
}
