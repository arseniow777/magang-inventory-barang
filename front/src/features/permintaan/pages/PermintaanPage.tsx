import { DataTable } from "../components/data-table";
import { usePermintaanData } from "../hooks/usePermintaanData";

export default function PermintaanPage() {
  const { data: requests = [], isLoading } = usePermintaanData();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daftar Permintaan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola permintaan peminjaman dan pengembalian barang
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p>Memuat data...</p>
        </div>
      ) : (
        <DataTable data={requests} />
      )}
    </div>
  );
}
