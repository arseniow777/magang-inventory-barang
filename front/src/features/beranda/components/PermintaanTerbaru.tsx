import { usePermintaanData } from "@/features/permintaan/hooks/usePermintaanData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";

const requestTypeLabels: Record<string, string> = {
  borrow: "Pinjam",
  transfer: "Pindah",
  sell: "Jual",
  demolish: "Hapus",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function PermintaanTerbaru() {
  const { data: requests = [], isLoading } = usePermintaanData();
  const recent = requests.slice(0, 5);

  return (
    <div className="bg-muted/50 rounded-xl p-4 h-full flex flex-col">
      <h2 className="text-base font-semibold mb-4">Permintaan Terbaru</h2>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Memuat data...
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-auto min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-muted-foreground">
                    No.
                  </TableHead>
                  <TableHead className="text-muted-foreground">PIC</TableHead>
                  <TableHead className="text-muted-foreground">Jenis</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Tanggal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-muted-foreground">
                {recent.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Tidak ada permintaan
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((req, index) => (
                    <TableRow key={req.id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}.
                      </TableCell>
                      <TableCell className="text-sm">{req.pic.name}</TableCell>
                      <TableCell className="text-sm">
                        {requestTypeLabels[req.request_type] ??
                          req.request_type}
                      </TableCell>
                      <TableCell className="text-sm text-right whitespace-nowrap">
                        {formatDate(req.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-3 shrink-0">
            <Link
              to="/dashboard/permintaan"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Lihat selengkapnya
              <IconArrowRight className="size-4" />
            </Link>
            <span className="text-sm text-muted-foreground">
              {recent.length}/{requests.length} Item
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
