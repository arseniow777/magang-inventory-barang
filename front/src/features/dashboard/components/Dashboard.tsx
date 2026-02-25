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
import { useEffect, useState, Fragment } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BarangPage from "../../barang/pages/BarangPage";
import CreatePage from "../../barang/pages/CreatePage";
import ItemDetailPage from "../../barang/pages/ItemDetailPage";
import ItemUnitDetailPage from "../../barang/pages/ItemUnitDetailPage";
import BerandaPage from "../../beranda/pages/BerandaPage";
import PermintaanPage from "../../permintaan/pages/PermintaanPage";
import BeritaPage from "../../berita/pages/BeritaPage";
import AuditPage from "../../audit/pages/AuditPage";
import PenggunaPage from "../../pengguna/pages/PenggunaPage";
import LokasiPage from "../../lokasi/pages/LokasiPage";
import NotificationsPage from "@/features/notifikasi/pages/NotificationsPage";
import ProfilPage from "../../akun/pages/ProfilPage";

const segmentLabels: { [key: string]: string } = {
  dashboard: "Dashboard",
  barang: "Barang",
  create: "Tambah Barang",
  units: "Unit",
  permintaan: "Daftar Permintaan",
  berita: "Berita Acara",
  lokasi: "Lokasi",
  pengguna: "Pengguna",
  audit: "Audit",
  users: "Users",
  notification: "Notifikasi",
};

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const getBreadcrumbs = () => {
    const segments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    let path = "";

    for (let i = 0; i < segments.length; i++) {
      path += `/${segments[i]}`;
      breadcrumbs.push({
        label: segmentLabels[segments[i]] || segments[i],
        path: path,
        isLast: i === segments.length - 1,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

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
          <div className="flex items-center gap-2 h-auto content-center">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:my-2"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <Fragment key={crumb.path}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.path}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
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
            <Route path="/barang/:id" element={<ItemDetailPage />} />
            <Route
              path="/barang/:itemId/units/:unitId"
              element={<ItemUnitDetailPage />}
            />

            {/* Administratif */}
            <Route path="/permintaan" element={<PermintaanPage />} />
            <Route path="/berita" element={<BeritaPage />} />
            <Route path="/lokasi" element={<LokasiPage />} />
            <Route path="/pengguna" element={<PenggunaPage />} />

            {/* Secondary */}
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/users/notifikasi" element={<NotificationsPage />} />
            <Route path="/users/profil" element={<ProfilPage />} />
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
