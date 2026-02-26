import { useRef } from "react";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";
import { getImageUrl } from "@/config/api";
import type { ItemPhotos } from "../../types/barang.types";

interface PhotoManagerProps {
  existingPhotos: ItemPhotos[];
  pendingDeleteIds: number[];
  newFiles: File[];
  onToggleDelete: (photoId: number) => void;
  onFileAdd: (files: File[]) => void;
  onRemoveNewFile: (index: number) => void;
}

export function PhotoManager({
  existingPhotos,
  pendingDeleteIds,
  newFiles,
  onToggleDelete,
  onFileAdd,
  onRemoveNewFile,
}: PhotoManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visibleExisting = existingPhotos.filter(
    (p) => !pendingDeleteIds.includes(p.id),
  );
  const totalSlots = visibleExisting.length + newFiles.length;
  const canAddMore = totalSlots < 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    onFileAdd(picked.slice(0, 3 - totalSlots));
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Foto{" "}
        <span className="text-muted-foreground font-normal">
          ({totalSlots}/3)
        </span>
      </p>

      <div className="flex gap-2 flex-wrap">
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
                onClick={() => onToggleDelete(photo.id)}
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

        {newFiles.map((file, i) => (
          <div key={i} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="h-20 w-20 rounded-md object-cover border"
            />
            <button
              type="button"
              onClick={() => onRemoveNewFile(i)}
              className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IconTrash className="h-3 w-3" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 rounded-b-md px-1 py-0.5">
              <p className="text-[10px] text-white truncate">Baru</p>
            </div>
          </div>
        ))}

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
  );
}
