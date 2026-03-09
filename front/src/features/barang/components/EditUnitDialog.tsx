import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUnit } from "../hooks/useUpdateUnit";
import { useLokasiData } from "@/features/lokasi/hooks/usePermintaanData";
import type { ItemUnitsWithLocation } from "../types/barang.types";

interface EditUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: ItemUnitsWithLocation;
  itemId: number;
}

export default function EditUnitDialog({
  open,
  onOpenChange,
  unit,
  itemId,
}: EditUnitDialogProps) {
  const { mutateAsync: updateUnit, isPending } = useUpdateUnit(unit.id, itemId);
  const { data: locations = [] } = useLokasiData();

  const [form, setForm] = useState({
    condition: unit.condition,
    status: unit.status,
    location_id: unit.location_id ? String(unit.location_id) : "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        condition: unit.condition,
        status: unit.status,
        location_id: unit.location_id ? String(unit.location_id) : "",
      });
    }
  }, [open, unit]);

  const handleSave = async () => {
    try {
      await updateUnit({
        condition: form.condition,
        status: form.status,
        location_id: parseInt(form.location_id),
      });
      toast.success("Berhasil memperbarui data unit");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memperbarui data",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Unit — {unit.unit_code}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Kondisi</Label>
            <Select
              value={form.condition}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  condition: v as typeof form.condition,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Baik</SelectItem>
                <SelectItem value="damaged">Rusak Ringan</SelectItem>
                <SelectItem value="broken">Rusak Berat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  status: v as typeof form.status,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="borrowed">Dipinjam</SelectItem>
                <SelectItem value="in_transit">Dalam Perjalanan</SelectItem>
                <SelectItem value="transferred">Dipindahkan</SelectItem>
                <SelectItem value="sold">Dijual</SelectItem>
                <SelectItem value="demolished">Dihapus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Select
              value={form.location_id}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, location_id: v ?? "" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.building_name} — Lt. {loc.floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
