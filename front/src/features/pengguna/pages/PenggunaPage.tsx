import { useUsersData } from "../hooks/usePenggunaData";
import { DataTable } from "../components/data-table";

export default function PenggunaPage() {
  const { data: users = [], isLoading } = useUsersData();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daftar Pengguna</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akun pengguna sistem inventaris
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p>Memuat data...</p>
        </div>
      ) : (
        <DataTable data={users} />
      )}
    </div>
  );
}
