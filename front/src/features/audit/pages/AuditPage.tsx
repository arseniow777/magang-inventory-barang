import { DataTable } from "../components/data-table";
import { usePermintaanData } from "../hooks/usePermintaanData";

export default function AuditPage() {
  const { data: requests = [], isLoading } = usePermintaanData();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permintaan & Peminjaman</h1>
          <p className="text-muted-foreground text-sm">
            Kelola permintaan barang dan peminjaman aset
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
