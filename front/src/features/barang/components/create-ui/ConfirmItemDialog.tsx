import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormSummary {
  name: string;
  category: string;
  quantity: number;
  procurement_year: string;
  photos: File[];
}

interface ConfirmItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormSummary;
  onConfirm: () => void;
}

export function ConfirmItemDialog({
  open,
  onOpenChange,
  formData,
  onConfirm,
}: ConfirmItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Penambahan Barang</DialogTitle>
          <DialogDescription>
            Pastikan semua data sudah benar sebelum menambahkan barang.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Nama:</span> {formData.name}
          </p>
          <p>
            <span className="font-semibold">Kategori:</span> {formData.category}
          </p>
          <p>
            <span className="font-semibold">Kuantitas:</span>{" "}
            {formData.quantity}
          </p>
          <p>
            <span className="font-semibold">Tahun Pengadaan:</span>{" "}
            {formData.procurement_year}
          </p>
          <p>
            <span className="font-semibold">Jumlah Foto:</span>{" "}
            {formData.photos.length}/3
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cek Lagi
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            Benar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
