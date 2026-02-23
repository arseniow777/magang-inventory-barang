import { useReportsData } from "../hooks/usePermintaanData";
import { DataTable } from "../components/data-table";

export default function BeritaPage() {
  const { data: reports = [], isLoading } = useReportsData();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Berita Acara</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daftar berita acara peminjaman dan pengembalian barang
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
