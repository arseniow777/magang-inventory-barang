import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconShoppingCartOff } from "@tabler/icons-react";

export function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <IconShoppingCartOff className="h-10 w-10 text-muted-foreground" />
      </div>
      <div>
        <p className="text-lg font-semibold">Keranjang kosong</p>
        <p className="text-sm text-muted-foreground mt-1">
          Tambahkan barang dari halaman detail barang atau detail unit.
        </p>
      </div>
      <Button onClick={() => navigate("/dashboard/barang")}>
        Mulai Pilih Barang
      </Button>
    </div>
  );
}
