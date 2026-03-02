import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getAuthImagePath } from "@/lib/timeOfDay";
import {
  IconEye,
  IconEyeOff,
  IconBrandTelegram,
  IconDeviceMobile,
} from "@tabler/icons-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

type Mode = "manual" | "telegram";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("manual");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { username: string; new_password: string }) =>
      apiClient.post("/auth/forgot-password", data),
    onSuccess: () => {
      setSubmitted(true);
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message ?? "Terjadi kesalahan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username dan password baru wajib diisi");
      return;
    }
    setError("");
    mutate({ username: username.trim(), new_password: password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
                <p className="text-muted-foreground text-balance">
                  Reset password akun InvenTel
                </p>
              </div>

              {/* Toggle */}
              <div className="flex rounded-lg border overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMode("manual");
                    setSubmitted(false);
                    setError("");
                  }}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium transition-colors",
                    mode === "manual"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("telegram");
                    setSubmitted(false);
                    setError("");
                  }}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium transition-colors",
                    mode === "telegram"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Telegram
                </button>
              </div>

              {mode === "manual" ? (
                submitted ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 rounded-full bg-green-100">
                      <IconDeviceMobile size={40} className="text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Request reset password berhasil diajukan. Tunggu approval
                      dari admin.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukan username"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="new-password">
                        Password Baru
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 8 karakter"
                          className="pr-10"
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
                    </Field>
                    <p
                      className={cn(
                        "text-red-600 text-xs",
                        error ? "visible" : "invisible",
                      )}
                    >
                      {error ?? "\u00A0"}
                    </p>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending ? (
                        <>
                          <Spinner />
                          <span className="ml-1">Mengirim...</span>
                        </>
                      ) : (
                        "Ajukan Reset Password"
                      )}
                    </Button>
                  </form>
                )
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="m-8 p-4 rounded-full bg-stone-100">
                    <IconBrandTelegram size={40} className="text-stone-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Buka bot Telegram <strong>@invetel_bot</strong>, lalu pilih
                    menu <strong>Ganti Password</strong> dan ikuti instruksinya.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open("https://t.me/invetel_bot", "_blank")
                    }
                  >
                    Buka Telegram Bot
                  </Button>
                </div>
              )}

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Kembali ke Login
              </Button>

              <FieldDescription className="text-center">
                Tidak dapat mengakses akun? Hubungi Admin atau IT Support
                perusahaan.
              </FieldDescription>
            </FieldGroup>
          </div>

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
