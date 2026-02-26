import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconBuildingCommunity } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateLokasi } from "../../hooks/usePermintaanData";
import { createLokasiSchema } from "../../schemas/lokasi.schema";

export function CreateLokasi() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { mutate: createLokasi, isPending } = useCreateLokasi();

  const [form, setForm] = useState({
    building_name: "",
    floor: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const payload = {
      building_name: form.building_name.trim(),
      floor: parseInt(form.floor),
      address: form.address.trim(),
    };

    const validation = createLokasiSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    createLokasi(validation.data, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["locations"] });
        toast.success("Lokasi berhasil ditambahkan");
        navigate("/dashboard/lokasi");
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Gagal menambahkan lokasi",
        ),
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-red-600 flex items-center justify-center shrink-0">
          <IconBuildingCommunity className="size-8 text-stone-100" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Tambahkan Lokasi Baru</h2>
          <p className="text-sm text-muted-foreground">
            Isi form berikut untuk menambahkan lokasi baru
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="building_name">Nama Gedung</Label>
          <Input
            id="building_name"
            name="building_name"
            value={form.building_name}
            onChange={handleChange}
            placeholder="Nama gedung"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="floor">Lantai</Label>
          <Input
            id="floor"
            name="floor"
            type="number"
            min={1}
            value={form.floor}
            onChange={handleChange}
            placeholder="Contoh: 2"
            // className="w-full sm:w-1/4"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Alamat</Label>
          <Textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Alamat lengkap"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/dashboard/lokasi")}>
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 text-white px-8"
        >
          {isPending ? "Menyimpan..." : "Konfirmasi"}
        </Button>
      </div>
    </div>
  );
}
