import { Separator } from "@/components/ui/separator";
import { useTransferCart } from "../hooks/useTransferCart";
import { useCreateTransfer } from "../hooks/useCreateTransfer";
import { EmptyCart } from "../components/EmptyCart";
import { TransferCartSummary } from "../components/TransferCartSummary";
import { TransferCheckoutForm } from "../components/TransferCheckoutForm";
import type { TransferFormValues } from "../types/transfer.types";

export default function TransferPage() {
  const { items } = useTransferCart();
  const { mutate: createTransfer, isPending } = useCreateTransfer();

  const handleSubmit = (values: TransferFormValues) => {
    createTransfer(values);
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold">Ajukan Permintaan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Periksa daftar barang dan pilih jenis permintaan sebelum mengajukan.
        </p>
      </div>

      <Separator />

      {/* Main content — Shopee-style: cart left, form right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Cart summary */}
        <div className="rounded-xl border bg-card p-6">
          <TransferCartSummary />
        </div>

        {/* Checkout form */}
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <div>
            <p className="font-semibold text-sm">Detail Pengiriman</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Isi lokasi tujuan dan alasan transfer.
            </p>
          </div>
          <Separator />
          <TransferCheckoutForm onSubmit={handleSubmit} isPending={isPending} />
        </div>
      </div>
    </div>
  );
}
