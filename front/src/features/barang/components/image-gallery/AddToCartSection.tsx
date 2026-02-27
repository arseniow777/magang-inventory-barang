import { useState } from "react";
import { IconMinus, IconPlus, IconShoppingCartPlus } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTransferCart } from "@/features/transfer/hooks/useTransferCart";
import { useAuthUser, Role } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

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
      <div className="space-y-5">
        <div className="flex w-full items-start gap-3">
          <div className="flex flex-col gap-2">
            <div className="space-y-2 text-center">
              <ButtonGroup
                orientation="horizontal"
                aria-label="Media controls"
                className="h-fit "
              >
                <Button
                  variant="outline"
                  className="rounded-sm"
                  size="icon"
                  onClick={() => setAddQty((q) => Math.max(1, q - 1))}
                  disabled={addQty <= 1}
                >
                  <IconMinus />
                </Button>
                <Input
                  className="w-auto"
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
                />
                <Button
                  variant="outline"
                  className="rounded-x-sm!"
                  size="icon"
                  onClick={() =>
                    setAddQty((q) => Math.min(availableUnits, q + 1))
                  }
                  disabled={addQty >= availableUnits}
                >
                  <IconPlus />
                </Button>
              </ButtonGroup>
              <p className="text-xs text-muted-foreground">
                maks {availableUnits} unit tersedia
              </p>
            </div>
          </div>
          <div className="w-full">
            <Button className="w-full rounded-sm" onClick={handleAddToCart}>
              <IconShoppingCartPlus size="lg" className="h-4 w-4 mr-2" />
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
