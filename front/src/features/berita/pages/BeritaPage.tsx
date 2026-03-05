// import { useReportsData } from "../hooks/usePermintaanData";
// import { DataTable } from "../components/data-table";

// export default function BeritaPage() {
//   const { data: reports = [], isLoading } = useReportsData();

//   return (
//     <div className="flex flex-1 flex-col gap-4">
//       <div className="flex items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">Berita Acara</h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Daftar berita acara peminjaman dan pengembalian barang
//           </p>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="flex items-center justify-center p-8">
//           <p>Memuat data...</p>
//         </div>
//       ) : (
//         <DataTable data={reports} />
//       )}
//     </div>
//   );
// }
import { useReportsData, useMyReportsData } from "../hooks/usePermintaanData";
import { DataTable } from "../components/data-table";
import { useAuthUser, Role } from "@/hooks/useAuthUser";

export default function BeritaPage() {
  const { data: authUser } = useAuthUser();
  const isAdmin = authUser?.role === Role.admin;

  const { data: allReports = [], isLoading: loadingAll } = useReportsData(
    undefined,
    { enabled: isAdmin },
  );
  const { data: myReports = [], isLoading: loadingMy } = useMyReportsData({
    enabled: !isAdmin,
  });

  const reports = isAdmin ? allReports : myReports;
  const isLoading = isAdmin ? loadingAll : loadingMy;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Berita Acara</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin
              ? "Daftar berita acara peminjaman dan pengembalian barang"
              : "Berita acara milik Anda"}
          </p>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p>Memuat data...</p>
        </div>
      ) : (
        <DataTable data={reports} />
      )}
    </div>
  );
}
