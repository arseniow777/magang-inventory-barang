import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FirstField } from "./first-field";
import { SecondField } from "./second-field";
import { LastField } from "./last-field";
import { useCreateItem } from "@/hooks/useItemQueries";
import { toast } from "sonner";

interface FormData {
  photos: File[];
  name: string;
  quantity: number;
  category: string;
  procurement_year: string;
  condition: string;
  location_id: string;
  pic_id: string;
}

export function CreateItemForm() {
  const navigate = useNavigate();
  const { mutate: createItem, isPending } = useCreateItem();
  const [formData, setFormData] = useState<FormData>({
    photos: [],
    name: "",
    quantity: 0,
    category: "",
    procurement_year: "",
    condition: "",
    location_id: "",
    pic_id: "",
  });

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      photos: [],
      name: "",
      quantity: 0,
      category: "",
      procurement_year: "",
      condition: "",
      location_id: "",
      pic_id: "",
    });
    setResetKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    navigate("/dashboard/barang");
  };

  const validateForm = (): boolean => {
    if (formData.photos.length === 0) {
      alert("Minimal 1 foto harus diupload");
      return false;
    }
    if (!formData.name.trim()) {
      alert("Nama barang harus diisi");
      return false;
    }
    if (formData.quantity <= 0) {
      alert("Kuantitas harus lebih dari 0");
      return false;
    }
    if (!formData.category) {
      alert("Kategori harus dipilih");
      return false;
    }
    if (!formData.procurement_year) {
      alert("Tahun pengadaan harus dipilih");
      return false;
    }
    if (!formData.location_id) {
      alert("Lokasi harus dipilih");
      return false;
    }
    if (!formData.pic_id) {
      alert("PIC harus dipilih");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setConfirmDialog(false);

    createItem(
      {
        name: formData.name,
        quantity: formData.quantity,
        category: formData.category,
        procurement_year: formData.procurement_year,
        location_id: formData.location_id,
        photos: formData.photos,
      },
      {
        onSuccess: () => {
          (toast.success("Berhasil menambahkan data", {
            position: "top-center",
          }),
            navigate("/dashboard/barang"));
        },
        onError: (error) => {
          (toast.error("Event has been created", { position: "top-center" }),
            console.error("Error creating item:", error));
          alert(
            error instanceof Error
              ? error.message
              : "Gagal menambahkan barang. Silakan coba lagi.",
          );
        },
      },
    );
  };

  return (
    <div className="w-full mx-auto py-6 space-y-6">
      {/* Form Sections */}
      <div className="flex flex-col md:flex-row w-full justify-between items-start gap-20 md:gap-10">
        <div className="w-full md:flex-1">
          <FirstField
            key={resetKey}
            formData={formData}
            onFieldChange={handleFieldChange}
          />
        </div>
        <div className="w-full md:flex-1">
          <SecondField formData={formData} onFieldChange={handleFieldChange} />
        </div>
        <div className="w-full md:flex-1 flex flex-col gap-6">
          <LastField formData={formData} onFieldChange={handleFieldChange} />

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-6 border-t">
            <Button
              onClick={() => setConfirmDialog(true)}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Memproses..." : "Tambahkan Data"}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="w-full">
              Batal
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              className="w-full"
            >
              Reset Data
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
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
              <span className="font-semibold">Kategori:</span>{" "}
              {formData.category}
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
              onClick={() => setConfirmDialog(false)}
              className="flex-1"
            >
              Cek Lagi
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Benar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
