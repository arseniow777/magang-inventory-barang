// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { useLogout } from "../hooks/useLogout";
// import { apiClient } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Spinner } from "@/components/ui/spinner";
// import { getAuthImagePath } from "@/lib/timeOfDay";
// import {
//   IconDeviceMobileOff,
//   IconDeviceMobileCheck,
// } from "@tabler/icons-react";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldSeparator,
// } from "@/components/ui/field";
// import { cn } from "@/lib/utils";
// import { ROUTES } from "@/constants/routes";

// interface TelegramLinkResponse {
//   telegram_link: string;
//   instructions: string;
// }

// export function TelegramConfirm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const navigate = useNavigate();
//   const { data: user, isLoading, refetch } = useAuth();
//   const { mutate: logout } = useLogout();
//   const [isGenerating, setIsGenerating] = useState(false);

//   const isLinked = !!user?.telegram_id;

//   const handleGenerateLink = async () => {
//     setIsGenerating(true);
//     try {
//       const data = await apiClient.post<TelegramLinkResponse>(
//         "/users/telegram/generate-link",
//       );
//       window.open(data.telegram_link, "_blank");
//     } catch {
//       // already linked or error — refetch to update state
//       await refetch();
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleRefresh = async () => {
//     await refetch();
//   };

//   const handleContinue = () => {
//     navigate(ROUTES.DASHBOARD);
//   };

//   const handleBack = () => {
//     logout();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-75">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card className="overflow-hidden p-0">
//         <CardContent className="grid p-0 md:grid-cols-2">
//           <div className="p-6 md:p-8">
//             <FieldGroup className="gap-6">
//               <div className="flex flex-col items-center gap-2 text-center">
//                 <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
//                 <p className="text-muted-foreground text-balance">
//                   {isLinked
//                     ? "Akun Telegram berhasil terhubung!"
//                     : "Akun anda belum terintegrasi dengan Telegram"}
//                 </p>
//               </div>

//               <div className="mx-auto p-5 rounded-full items-center text-center bg-neutral-100">
//                 {isLinked ? (
//                   <IconDeviceMobileCheck size={50} className="text-green-600" />
//                 ) : (
//                   <IconDeviceMobileOff size={50} className="text-neutral-500" />
//                 )}
//               </div>

//               {isLinked ? (
//                 <>
//                   <div className="flex flex-col items-center gap-2 text-center">
//                     <p className="text-muted-foreground text-balance">
//                       Sekarang Anda bisa menerima notifikasi real-time untuk
//                       peminjaman, reset password, status berita acara, dan
//                       informasi penting lainnya agar pengelolaan aset lebih
//                       cepat dan terkontrol.
//                     </p>
//                   </div>

//                   <Field>
//                     <Button
//                       type="button"
//                       onClick={handleContinue}
//                       className="w-full"
//                     >
//                       Lanjutkan ke beranda
//                     </Button>
//                   </Field>
//                 </>
//               ) : (
//                 <>
//                   {/* <div className="flex flex-col items-center gap-2 text-center">
//                     <p className="text-muted-foreground text-balance">
//                       Cari bot <strong>@invetel_bot</strong> di Telegram, lalu
//                       kirim pesan untuk menghubungkan akun.
//                     </p>
//                   </div>

//                   <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
//                     Atau
//                   </FieldSeparator> */}

//                   <div className="flex flex-col items-center gap-2 text-center">
//                     <p className="text-muted-foreground text-balance">
//                       Klik link dibawah untuk membuka bot Telegram
//                     </p>
//                   </div>

//                   <Field>
//                     <Button
//                       type="button"
//                       className="w-full"
//                       disabled={isGenerating}
//                       onClick={handleGenerateLink}
//                     >
//                       {isGenerating ? (
//                         <>
//                           <Spinner />
//                           <span className="ml-0.5">Membuat link...</span>
//                         </>
//                       ) : (
//                         "Link Telegram"
//                       )}
//                     </Button>
//                   </Field>

//                   <Field>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={handleBack}
//                       className="w-full"
//                     >
//                       Kembali masuk
//                     </Button>
//                   </Field>

//                   <Field>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       onClick={handleContinue}
//                       className="w-full"
//                     >
//                       Lewati untuk sekarang
//                     </Button>
//                   </Field>
//                 </>
//               )}

//               <FieldDescription className="text-center">
//                 Tidak dapat mengakses akun? Hubungi Admin atau IT Support
//                 perusahaan.
//               </FieldDescription>
//             </FieldGroup>
//           </div>

//           <div className="bg-muted relative hidden md:block">
//             <img
//               src={getAuthImagePath()}
//               alt="Image"
//               className="absolute inset-0 h-full w-full object-cover object-left brightness-90"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       <FieldDescription className="px-6 text-center italic">
//         Data Terkendali, Operasi Terkendali.
//       </FieldDescription>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useLogout";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getAuthImagePath } from "@/lib/timeOfDay";
import { QRCodeSVG } from "qrcode.react";
import {
  IconDeviceMobileOff,
  IconDeviceMobileCheck,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface TelegramLinkResponse {
  telegram_link: string;
  instructions: string;
}

export function TelegramConfirm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { data: user, isLoading, refetch } = useAuth();
  const { mutate: logout } = useLogout();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [telegramLink, setTelegramLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isLinked = !!user?.telegram_id;

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (telegramLink && !isLinked) {
      pollingRef.current = setInterval(async () => {
        await refetch();
      }, 3000);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [telegramLink, isLinked]);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const data = await apiClient.post<TelegramLinkResponse>(
        "/users/telegram/generate-link",
      );
      setTelegramLink(data.telegram_link);
    } catch {
      await refetch();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckConnection = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleCopyLink = async () => {
    if (!telegramLink) return;
    await navigator.clipboard.writeText(telegramLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleBack = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
                <p className="text-muted-foreground text-balance">
                  {isLinked
                    ? "Akun Telegram berhasil terhubung!"
                    : telegramLink
                      ? "Scan QR code dengan kamera HP Anda"
                      : "Akun anda belum terintegrasi dengan Telegram"}
                </p>
              </div>

              {isLinked ? (
                <>
                  <div className="mx-auto p-5 rounded-full items-center text-center bg-neutral-100">
                    <IconDeviceMobileCheck
                      size={50}
                      className="text-green-600"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-muted-foreground text-balance">
                      Sekarang Anda bisa menerima notifikasi real-time untuk
                      peminjaman, reset password, status berita acara, dan
                      informasi penting lainnya agar pengelolaan aset lebih
                      cepat dan terkontrol.
                    </p>
                  </div>

                  <Field>
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="w-full"
                    >
                      Lanjutkan ke beranda
                    </Button>
                  </Field>
                </>
              ) : telegramLink ? (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-sm border p-3 bg-white">
                      <QRCodeSVG value={telegramLink} size={180} />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Buka kamera HP dan arahkan ke QR code di atas
                    </p>
                  </div>

                  <Field>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => window.open(telegramLink, "_blank")}
                    >
                      Buka di Telegram
                    </Button>
                  </Field>

                  <Field>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleCopyLink}
                    >
                      {copied ? (
                        <>
                          <IconCheck className="h-4 w-4 mr-2" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <IconCopy className="h-4 w-4 mr-2" />
                          Salin Link
                        </>
                      )}
                    </Button>
                  </Field>

                  <Field>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      disabled={isRefreshing}
                      onClick={handleCheckConnection}
                    >
                      {isRefreshing ? (
                        <>
                          <Spinner />
                          <span className="ml-0.5">Mengecek...</span>
                        </>
                      ) : (
                        "Sudah Terhubung?"
                      )}
                    </Button>
                  </Field>
                </>
              ) : (
                <>
                  <div className="mx-auto p-5 rounded-full items-center text-center bg-neutral-100">
                    <IconDeviceMobileOff
                      size={50}
                      className="text-neutral-500"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-muted-foreground text-balance">
                      Klik link dibawah untuk membuka bot Telegram
                    </p>
                  </div>

                  <Field>
                    <Button
                      type="button"
                      className="w-full"
                      disabled={isGenerating}
                      onClick={handleGenerateLink}
                    >
                      {isGenerating ? (
                        <>
                          <Spinner />
                          <span className="ml-0.5">Membuat link...</span>
                        </>
                      ) : (
                        "Link Telegram"
                      )}
                    </Button>
                  </Field>

                  <Field>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="w-full"
                    >
                      Kembali masuk
                    </Button>
                  </Field>

                  <Field>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleContinue}
                      className="w-full"
                    >
                      Lewati untuk sekarang
                    </Button>
                  </Field>
                </>
              )}

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
