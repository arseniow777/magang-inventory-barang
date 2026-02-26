import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconUser } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser } from "../../hooks/usePenggunaData";
import type { UserData } from "../../types/pengguna.types";

export function EditPengguna() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const [form, setForm] = useState({
    name: "",
    username: "",
    role: "",
    phone_local: "",
    telegram_id: "",
    is_active: true,
  });

  useEffect(() => {
    const users = qc.getQueryData<UserData[]>(["users"]);
    const user = users?.find((u) => u.id === Number(id));
    if (user) {
      let raw = user.phone_number ?? "";
      raw = raw.replace(/\s/g, "");
      if (raw.startsWith("+62")) raw = raw.slice(3);
      else if (raw.startsWith("62")) raw = raw.slice(2);
      else if (raw.startsWith("0")) raw = raw.slice(1);

      setForm({
        name: user.name ?? "",
        username: user.username ?? "",
        role: user.role ?? "",
        phone_local: raw,
        telegram_id: user.telegram_id ?? "",
        is_active: user.is_active ?? true,
      });
    }
  }, [id, qc]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.username.trim() || !form.role) {
      toast.error("Nama, username, dan role wajib diisi");
      return;
    }

    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
      role: form.role as "pic" | "admin",
      phone_number: form.phone_local.trim()
        ? `+62${form.phone_local.trim()}`
        : null,
      telegram_id: form.telegram_id.trim() || null,
      is_active: form.is_active,
    };

    updateUser(
      { id: Number(id), data: payload },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["users"] });
          toast.success("Pengguna berhasil diupdate");
          navigate("/dashboard/pengguna");
        },
        onError: (err) =>
          toast.error(
            err instanceof Error ? err.message : "Gagal mengupdate pengguna",
          ),
      },
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-red-600 flex items-center justify-center shrink-0">
          <IconUser className="size-12 text-stone-100" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Edit Pengguna</h2>
          <p className="text-sm text-muted-foreground">
            Ubah data pengguna yang diperlukan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama lengkap"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, role: v ?? "" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="pic">PIC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="phone_local">
              No. HP{" "}
              <span className="text-muted-foreground text-xs">(opsional)</span>
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm shrink-0">
                +62
              </span>
              <Input
                id="phone_local"
                name="phone_local"
                value={form.phone_local}
                onChange={handleChange}
                placeholder="815xxxxxxxx"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telegram_id">
              Telegram ID{" "}
              <span className="text-muted-foreground text-xs">(opsional)</span>
            </Label>
            <Input
              id="telegram_id"
              name="telegram_id"
              value={form.telegram_id}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.is_active ? "active" : "inactive"}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, is_active: v === "active" }))
            }
          >
            <SelectTrigger className="w-full sm:w-1/2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/pengguna")}
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 text-white px-8"
        >
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
