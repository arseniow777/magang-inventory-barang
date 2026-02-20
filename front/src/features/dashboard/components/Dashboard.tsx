import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BarangPage from "../../barang/pages/BarangPage";
import CreatePage from "../../createbarang/pages/CreatePage";
import BerandaPage from "../../beranda/pages/BerandaPage";
import PermintaanPage from "../../permintaan/pages/PermintaanPage";
import BeritaPage from "../../berita/pages/BeritaPage";
import AuditPage from "../../audit/pages/AuditPage";
import PenggunaPage from "../../pengguna/pages/PenggunaPage";
import LokasiPage from "../../lokasi/pages/LokasiPage";
import NotificationsPage from "@/features/notifikasi/pages/NotificationsPage";

const placeholders: { [key: string]: string } = {
  "/dashboard": "Beranda",
  "/dashboard/barang": "Barang",
  "/dashboard/permintaan": "Daftar permintaan",
  "/dashboard/berita": "Berita acara",
  "/dashboard/lokasi": "Lokasi",
  "/dashboard/pengguna": "Pengguna",
  "/dashboard/users/notification": "Notifikasi",
};

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const currentPage = placeholders[location.pathname] || "Dashboard";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode =
      savedTheme === "dark" ||
      (!savedTheme && document.documentElement.classList.contains("dark"));
    setIsDark(isDarkMode);
    applyTheme(isDarkMode);
  }, []);

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg"
          >
            {isDark ? (
              <IconSun className="h-5 w-5" />
            ) : (
              <IconMoon className="h-5 w-5" />
            )}
          </Button>
        </header>

        {/* Dynamic Content based on Route */}
        <div className="flex flex-1 flex-col p-7">
          <Routes>
            {/* Umum */}
            <Route path="/" element={<BerandaPage />} />
            <Route path="/barang" element={<BarangPage />} />
            <Route path="/barang/create" element={<CreatePage />} />

            {/* Administratif */}
            <Route path="/permintaan" element={<PermintaanPage />} />
            <Route path="/berita" element={<BeritaPage />} />
            <Route path="/lokasi" element={<LokasiPage />} />
            <Route path="/pengguna" element={<PenggunaPage />} />

            {/* Secondary */}
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/users/notification" element={<NotificationsPage />} />
            <Route
              path="/*"
              element={
                <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                  <div className="flex items-center justify-center text-gray-500 flex-1">
                    <p className="text-lg">Coming soon...</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
