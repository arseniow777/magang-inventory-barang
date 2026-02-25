import { useQuery } from "@tanstack/react-query";
import { useBarangItems } from "@/features/barang/hooks/useBarangItems";
import { itemUnitsAPI } from "@/features/barang/api/barang.api";
import {
  IconPackage,
  IconBox,
  IconArrowsTransferDown,
} from "@tabler/icons-react";

function useItemsBorrowed() {
  return useQuery({
    queryKey: ["item-units", "borrowed"],
    queryFn: () => itemUnitsAPI.getUnitsByStatus("borrowed"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export default function InformasiSekilas() {
  const { data: items = [], isLoading: loadingItems } = useBarangItems();
  const { data: borrowed = [], isLoading: loadingBorrowed } =
    useItemsBorrowed();

  const totalJenis = items.length;
  const totalUnit = items.reduce(
    (sum, item) => sum + (item._count?.units ?? 0),
    0,
  );
  const totalBorrowed = borrowed.length;

  const isLoading = loadingItems || loadingBorrowed;

  const stats = [
    { label: "Total Jenis Barang", value: totalJenis, icon: IconPackage },
    { label: "Total Item Barang", value: totalUnit, icon: IconBox },
    {
      label: "Total Dipinjamkan",
      value: totalBorrowed,
      icon: IconArrowsTransferDown,
    },
  ];

  return (
    <div className="bg-muted/50 rounded-xl p-4 h-full flex flex-col gap-3">
      <h2 className="text-base font-semibold">Informasi Sekilas</h2>
      <div className="flex flex-col gap-3 flex-1">
        {stats.map(({ label, value, icon: Icon }) => (
          // ganti className pada div stat item
          <div
            key={label}
            className="bg-neutral-200 dark:bg-neutral-800 rounded-full px-4 py-3 md:py-2 xl:py-4 flex items-center gap-3 flex-1"
          >
            <div className="bg-muted/50 rounded-full p-2 shrink-0">
              <Icon className="text-red-500/70 size-5 md:size-4 xl:size-6" />
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-xl md:text-lg xl:text-2xl font-bold leading-tight">
                {isLoading ? "..." : value.toLocaleString("id-ID")}
              </p>
              <p className="text-muted-foreground text-xs md:text-[11px] xl:text-sm truncate">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
