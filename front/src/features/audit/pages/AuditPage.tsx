import { DataTable } from "../components/data-table";
import { useAuditData } from "../hooks/useAuditData";

export default function AuditPage() {
  const { data, isLoading } = useAuditData();
  const logs = data?.logs ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground text-sm">
            Riwayat semua aktivitas dalam sistem
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p>Memuat data...</p>
        </div>
      ) : (
        <DataTable data={logs} />
      )}
    </div>
  );
}
