import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useCreateUser } from "../../hooks/usePenggunaData";
import { createUserSchema } from "../../schemas/pengguna.schema";
import { IconUser, IconEyeOff, IconEye } from "@tabler/icons-react";

const PRESET_PASSWORDS = ["Telkom@123", "Invetel@2024", "User@12345"];

export function CreatePengguna() {
  const navigate = useNavigate();
  const { mutate: createUser, isPending } = useCreateUser();

  const [form, setForm] = useState({
    name: "",
    employee_id: "",
    username: "",
    password: "",
    role: "",
    phone_local: "",
    telegram_id: "",
  });

  const [passwordMode, setPasswordMode] = useState<"preset" | "manual">(
    "preset",
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name.trim(),
      employee_id: form.employee_id.trim(),
      username: form.username.trim(),
      password: form.password,
      role: form.role as "pic" | "admin",
      phone_number: form.phone_local.trim() ? form.phone_local.trim() : null,
      telegram_id: form.telegram_id.trim() || null,
    };

    const validation = createUserSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    const finalPayload = {
      ...validation.data,
      phone_number: validation.data.phone_number
        ? `+62${validation.data.phone_number}`
        : null,
    };

    createUser(finalPayload as any, {
      onSuccess: () => {
        toast.success("Pengguna berhasil ditambahkan");
        navigate("/dashboard/pengguna");
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Gagal menambahkan pengguna",
        ),
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-red-600 flex items-center justify-center shrink-0">
          <IconUser className="size-12 text-stone-100" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Tambahkan User Baru</h2>
          <p className="text-sm text-muted-foreground">
            Isi form berikut untuk menambahkan user baru
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
            <Label htmlFor="employee_id">ID Karyawan</Label>
            <Input
              id="employee_id"
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              placeholder="A11.2024.00001"
              className="font-mono"
            />
          </div>

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label>Password</Label>
            <div className="flex gap-2">
              <Select
                value={passwordMode}
                onValueChange={(v) => {
                  setPasswordMode(v as "preset" | "manual");
                  setForm((prev) => ({ ...prev, password: "" }));
                }}
              >
                <SelectTrigger className="w-28 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preset">Preset</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>

              {passwordMode === "preset" ? (
                <Select
                  value={form.password}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, password: v ?? "" }))
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih password" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_PASSWORDS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative flex-1">
                  <Input
                    className="w-full pr-10"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <IconEyeOff className="size-4" />
                    ) : (
                      <IconEye className="size-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
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
          {isPending ? "Menyimpan..." : "Konfirmasi"}
        </Button>
      </div>
    </div>
  );
}
