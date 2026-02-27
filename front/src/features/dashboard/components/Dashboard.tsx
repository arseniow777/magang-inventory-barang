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
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuthUser, Role } from "@/hooks/useAuthUser";
import { AdminRoute } from "@/features/auth/components/AdminRoute";
import { GuestRoute } from "@/features/auth/components/GuestRoute";
import BarangPage from "../../barang/pages/BarangPage";
import CreatePage from "../../barang/pages/CreatePage";
import ItemPage from "../../barang/pages/ItemPage";
import ItemUnitPage from "../../barang/pages/ItemUnitPage";
import BerandaPage from "../../beranda/pages/BerandaPage";
import PermintaanPage from "../../permintaan/pages/PermintaanPage";
import PasswordResetsPage from "../../permintaan/pages/PasswordResetsPage";
import BeritaPage from "../../berita/pages/BeritaPage";
import AuditPage from "../../audit/pages/AuditPage";
import PenggunaPage from "../../pengguna/pages/PenggunaPage";
import LokasiPage from "../../lokasi/pages/LokasiPage";
import NotificationsPage from "@/features/notifikasi/pages/NotificationsPage";
import ProfilPage from "../../akun/pages/ProfilPage";
import TambahPenggunaPage from "@/features/pengguna/pages/TambahPenggunaPage";
import TransferPage from "../../transfer/pages/TransferPage";
import { TransferCartBadge } from "../../transfer/components/TransferCartBadge";
import EditPenggunaPage from "@/features/pengguna/pages/EditPenggunaPage";
import TambahLokasiPage from "@/features/lokasi/pages/TambahLokasiPage";
import EditLokasiPage from "@/features/lokasi/pages/EditLokasiPage";
import BantuanPage from "@/features/bantuan/pages/BantuanPage";

const segmentLabels: { [key: string]: string } = {
  dashboard: "Dashboard",
  barang: "Barang",
  create: "Tambah Barang",
  units: "Unit",
  permintaan: "Daftar Permintaan",
  "reset-password": "Reset Password",
  berita: "Berita Acara",
  lokasi: "Lokasi",
  tambah: "Tambah Lokasi",
  edit: "Edit Lokasi",
  pengguna: "Pengguna",
  audit: "Audit",
  users: "Users",
  notification: "Notifikasi",
  transfer: "Transfer Barang",
};

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { data: authUser } = useAuthUser();
  const isAdmin = authUser?.role === Role.admin;

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
          <div className="flex items-center gap-1">
            {!isAdmin && <TransferCartBadge />}
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
          </div>
        </header>

        {/* Dynamic Content based on Route */}
        <div className="flex flex-1 flex-col p-4 md:p-7">
          <Routes>
            {/* Root — admin ke Beranda, PIC ke Barang */}
            <Route
              path="/"
              element={
                isAdmin ? (
                  <BerandaPage />
                ) : (
                  <Navigate to="/dashboard/barang" replace />
                )
              }
            />

            {/* Umum — semua role */}
            <Route path="/barang" element={<BarangPage />} />
            <Route path="/barang/:id" element={<ItemPage />} />
            <Route path="/barang/:itemId/:unitId" element={<ItemUnitPage />} />
            <Route
              path="/users/notifikasi"
              element={
                <GuestRoute>
                  <NotificationsPage />
                </GuestRoute>
              }
            />
            <Route
              path="/users/profil"
              element={
                <GuestRoute>
                  <ProfilPage />
                </GuestRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/barang/create"
              element={
                <AdminRoute>
                  <CreatePage />
                </AdminRoute>
              }
            />
            <Route
              path="/permintaan"
              element={
                <GuestRoute>
                  <PermintaanPage />
                </GuestRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <GuestRoute>
                  <TransferPage />
                </GuestRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <AdminRoute>
                  <PasswordResetsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/berita"
              element={
                <AdminRoute>
                  <BeritaPage />
                </AdminRoute>
              }
            />
            <Route
              path="/lokasi"
              element={
                <AdminRoute>
                  <LokasiPage />
                </AdminRoute>
              }
            />
            <Route
              path="/lokasi/tambah"
              element={
                <AdminRoute>
                  <TambahLokasiPage />
                </AdminRoute>
              }
            />
            <Route
              path="/lokasi/edit/:id"
              element={
                <AdminRoute>
                  <EditLokasiPage />
                </AdminRoute>
              }
            />
            <Route
              path="/pengguna"
              element={
                <AdminRoute>
                  <PenggunaPage />
                </AdminRoute>
              }
            />
            <Route
              path="/pengguna/tambahPengguna"
              element={
                <AdminRoute>
                  <TambahPenggunaPage />
                </AdminRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <AdminRoute>
                  <AuditPage />
                </AdminRoute>
              }
            />
            <Route path="/pengguna/edit/:id" element={<EditPenggunaPage />} />
            <Route
              path="/bantuan"
              element={
                <AdminRoute>
                  <BantuanPage />
                </AdminRoute>
              }
            />
            <Route path="/pengguna/edit/:id" element={<EditPenggunaPage />} />

            <Route
              path="/*"
              element={
                <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                  <div className="flex items-center justify-center text-gray-500 flex-1">
                    <p className="text-lg">404</p>
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
