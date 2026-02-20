import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { getAuthImagePath } from "@/lib/timeOfDay";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [data, setData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    mutate(validation.data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
                <p className="text-muted-foreground text-balance">
                  Masuk dengan akun InvenTel
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="username">Nama pengguna</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukan username..."
                  value={data.username}
                  onChange={(e) =>
                    setData({ ...data, username: e.target.value })
                  }
                />
                <p
                  className={cn(
                    "text-red-600 text-xs",
                    errors.username ? "visible" : "invisible",
                  )}
                >
                  {errors.username?.[0] ?? "\u00A0"}
                </p>
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p
                  className={cn(
                    "text-red-600 text-xs",
                    errors.password ? "visible" : "invisible",
                  )}
                >
                  {errors.password?.[0] ?? "\u00A0"}
                </p>
              </Field>

              <Field>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <Spinner />
                      <span className="ml-0.5">Memuat...</span>
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </Field>

              <p
                className={cn(
                  "text-red-600 text-xs text-center",
                  error ? "visible" : "invisible",
                )}
              >
                {error?.message ?? "\u00A0"}
              </p>

              <FieldDescription className="text-center">
                Tidak dapat mengakses akun? Hubungi Admin atau IT Support
                perusahaan.
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src={getAuthImagePath()}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover object-left brightness-90"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center italic">
        Data Terkendali, Operasi Terkendali.
      </FieldDescription>
    </div>
  );
}
