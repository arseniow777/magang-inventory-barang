import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateItem } from "../hooks/useUpdateItem";
import { itemsMasterAPI } from "../api/barang.api";
import type { ItemMasterDetail } from "../types/barang.types";
import { PhotoManager } from "./edit-dialog/PhotoManager";
import { EditItemFields } from "./edit-dialog/EditItemFields";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemMasterDetail;
}

export default function EditItemDialog({
  open,
  onOpenChange,
  item,
}: EditItemDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateItem, isPending: isSaving } = useUpdateItem(
    item.id,
  );

  const [form, setForm] = useState({
    name: item.name,
    category: item.category,
    procurement_year: String(item.procurement_year),
  });
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: item.name,
      category: item.category,
      procurement_year: String(item.procurement_year),
    });
  }, [item.name, item.category, item.procurement_year]);

  useEffect(() => {
    if (open) {
      setPendingDeleteIds([]);
      setNewFiles([]);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleDelete = (photoId: number) =>
    setPendingDeleteIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );

  const handleFileAdd = (files: File[]) =>
    setNewFiles((prev) => [...prev, ...files]);

  const removeNewFile = (i: number) =>
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const year = parseInt(form.procurement_year, 10);
    if (!form.name.trim()) return toast.error("Nama barang tidak boleh kosong");
    if (!form.category.trim())
      return toast.error("Kategori tidak boleh kosong");
    if (isNaN(year) || year < 1900 || year > 2100)
      return toast.error("Tahun pengadaan tidak valid");

    try {
      setIsPhotoLoading(true);
      await updateItem({
        name: form.name.trim(),
        category: form.category.trim(),
        procurement_year: year,
      });
      await Promise.all(
        pendingDeleteIds.map((id) => itemsMasterAPI.deletePhoto(item.id, id)),
      );
      for (const file of newFiles) {
        const fd = new FormData();
        fd.append("photos", file);
        await itemsMasterAPI.uploadPhoto(item.id, fd);
      }
      queryClient.invalidateQueries({ queryKey: ["item", item.id] });
      toast.success("Berhasil memperbarui data barang");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memperbarui data",
      );
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const isPending = isSaving || isPhotoLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Barang</DialogTitle>
        </DialogHeader>
        <PhotoManager
          existingPhotos={item.photos ?? []}
          pendingDeleteIds={pendingDeleteIds}
          newFiles={newFiles}
          onToggleDelete={toggleDelete}
          onFileAdd={handleFileAdd}
          onRemoveNewFile={removeNewFile}
        />
        <EditItemFields form={form} onChange={handleChange} />
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
