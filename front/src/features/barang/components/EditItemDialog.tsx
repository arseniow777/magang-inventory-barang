import { useEffect, useRef, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";
import { useUpdateItem } from "../hooks/useUpdateItem";
import { itemsMasterAPI } from "../api/barang.api";
import { getImageUrl } from "@/config/api";
import type { ItemMasterDetail, ItemPhotos } from "../types/barang.types";

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: item.name,
    category: item.category,
    procurement_year: String(item.procurement_year),
  });

  // IDs of existing photos queued for deletion
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  // New local files queued for upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // Sync text fields when item refreshes
  useEffect(() => {
    setForm({
      name: item.name,
      category: item.category,
      procurement_year: String(item.procurement_year),
    });
  }, [item.name, item.category, item.procurement_year]);

  // Reset photo state when dialog opens
  useEffect(() => {
    if (open) {
      setPendingDeleteIds([]);
      setNewFiles([]);
    }
  }, [open]);

  const existingPhotos: ItemPhotos[] = item.photos ?? [];
  const visibleExisting = existingPhotos.filter(
    (p) => !pendingDeleteIds.includes(p.id),
  );
  const totalSlots = visibleExisting.length + newFiles.length;
  const canAddMore = totalSlots < 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    const remaining = 3 - totalSlots;
    setNewFiles((prev) => [...prev, ...picked.slice(0, remaining)]);
    // reset so the same file can be re-selected if removed
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDelete = (photoId: number) => {
    setPendingDeleteIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );
  };

  const handleSave = async () => {
    const year = parseInt(form.procurement_year, 10);

    if (!form.name.trim()) return toast.error("Nama barang tidak boleh kosong");
    if (!form.category.trim())
      return toast.error("Kategori tidak boleh kosong");
    if (isNaN(year) || year < 1900 || year > 2100)
      return toast.error("Tahun pengadaan tidak valid");

    try {
      setIsPhotoLoading(true);

      // 1. save text fields
      await updateItem({
        name: form.name.trim(),
        category: form.category.trim(),
        procurement_year: year,
      });

      // 2. delete marked photos
      await Promise.all(
        pendingDeleteIds.map((photoId) =>
          itemsMasterAPI.deletePhoto(item.id, photoId),
        ),
      );

      // 3. upload new files one by one (backend appends, max 3)
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

        {/* ── Photos ── */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Foto{" "}
            <span className="text-muted-foreground font-normal">
              ({totalSlots}/3)
            </span>
          </p>

          <div className="flex gap-2 flex-wrap">
            {/* Existing photos */}
            {existingPhotos.map((photo) => {
              const markedForDelete = pendingDeleteIds.includes(photo.id);
              return (
                <div key={photo.id} className="relative group">
                  <img
                    src={getImageUrl(photo.file_path)}
                    alt=""
                    className={`h-20 w-20 rounded-md object-cover border transition-opacity ${
                      markedForDelete ? "opacity-30" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleDelete(photo.id)}
                    className={`absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs transition-colors ${
                      markedForDelete
                        ? "bg-muted-foreground"
                        : "bg-destructive opacity-0 group-hover:opacity-100"
                    }`}
                    title={markedForDelete ? "Batalkan hapus" : "Hapus foto"}
                  >
                    <IconTrash className="h-3 w-3" />
                  </button>
                </div>
              );
            })}

            {/* New file previews */}
            {newFiles.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-20 w-20 rounded-md object-cover border"
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IconTrash className="h-3 w-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 rounded-b-md px-1 py-0.5">
                  <p className="text-[10px] text-white truncate">Baru</p>
                </div>
              </div>
            ))}

            {/* Add button */}
            {canAddMore && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-20 w-20 rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <IconUpload className="h-5 w-5" />
                <span className="text-[10px]">Tambah</span>
              </button>
            )}

            {/* Empty state */}
            {existingPhotos.length === 0 && newFiles.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <IconPhoto className="h-4 w-4" />
                <span>Belum ada foto</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* ── Text fields ── */}
        <FieldGroup>
          <Field>
            <FieldLabel>Nama Barang</FieldLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama barang"
            />
          </Field>
          <Field>
            <FieldLabel>Kategori</FieldLabel>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Kategori"
            />
          </Field>
          <Field>
            <FieldLabel>Tahun Pengadaan</FieldLabel>
            <Input
              name="procurement_year"
              type="number"
              value={form.procurement_year}
              onChange={handleChange}
              placeholder="Contoh: 2024"
            />
          </Field>
        </FieldGroup>

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
