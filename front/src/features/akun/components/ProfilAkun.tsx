import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useAkun } from "../hooks/useAkun";
import { useUpdateAkun } from "../hooks/useUpdateAkun";
import { updateAccountSchema } from "../schemas/akun.schema";

export function ProfilAkun() {
  const { data, isLoading, error } = useAkun();
  const { mutate: updateAkun, isPending } = useUpdateAkun();

  const [form, setForm] = useState({
    username: "",
    name: "",
    phone_local: "",
  });

 useEffect(() => {
    if (data) {
      let raw = data.phone_number ?? "";

      // Hilangkan spasi
      raw = raw.replace(/\s/g, "");

      // Hilangkan prefix +62 atau 62 atau 0
      if (raw.startsWith("+62")) {
        raw = raw.slice(3);
      } else if (raw.startsWith("62")) {
        raw = raw.slice(2);
      } else if (raw.startsWith("0")) {
        raw = raw.slice(1);
      }

      setForm({
        username: data.username ?? "",
        name: data.name ?? "",
        phone_local: raw,
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const phone = form.phone_local.trim();

    const payload = {
      username: form.username.trim(),
      name: form.name.trim(),
      phone_number: phone ? phone : null, // validate raw digits
    };

    const validation = updateAccountSchema.safeParse(payload);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message;
      toast.error(firstError ?? "Data tidak valid");
      return;
    }

    const data = {
      ...validation.data,
      phone_number: validation.data.phone_number
        ? `+62${validation.data.phone_number}`
        : null,
    };

    updateAkun(data, {
      onSuccess: () => toast.success("Profil berhasil disimpan"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Gagal menyimpan profil"),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full h-40 sm:h-52 rounded-lg overflow-hidden">
        <img src="../../../../public/bannerProfil.png" className="w-full h-full object-cover object-[75%]" />
      </div>

      <FieldGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="employee_id">Employee ID</FieldLabel>
            <Input
              id="employee_id"
              value={data?.employee_id ?? "-"}
              disabled
              className="disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Input
              id="role"
              value={data?.role ?? "-"}
              disabled
              className="disabled:opacity-60 disabled:cursor-not-allowed capitalize"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Input
              id="status"
              value={data?.is_active ? "Aktif" : "Tidak Aktif"}
              disabled
              className="disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone_local">Phone Number</FieldLabel>
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
          </Field>
        </div>

        <Field orientation="horizontal" className="justify-end">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            {isPending ? <Spinner className="size-4" /> : "Simpan"}
          </Button>
        </Field>
      </FieldGroup>
    </div>
  );
}