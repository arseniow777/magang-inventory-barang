import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";
import DetailGrid from "../DetailGrid";
import type { ItemMasterDetail } from "../../types/barang.types";

interface ItemInfoPanelProps {
  item?: ItemMasterDetail;
  isAdmin: boolean;
  onEditClick: () => void;
  itemName?: string;
  modelCode?: string;
  totalUnits?: number;
  availableUnits?: number;
  goodUnits?: number;
}

export function ItemInfoPanel({
  item,
  isAdmin,
  onEditClick,
  itemName,
  modelCode,
  totalUnits,
  availableUnits,
  goodUnits,
}: ItemInfoPanelProps) {
  const infoRows = [
    { label: "Kategori", value: item?.category ?? "—" },
    { label: "Tahun Pengadaan", value: item?.procurement_year ?? "—" },
    {
      label: "Kode Model",
      value: <span className="font-mono">{item?.model_code ?? "—"}</span>,
    },
    {
      label: "Ditambahkan",
      value: item?.created_at
        ? new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <>
          <div className="flex w-full items-center mb-5">
            <div>
              <h1 className="text-2xl font-semibold leading-tight mb-1">
                {itemName ?? "—"}
              </h1>
              <p className="text-sm text-muted-foreground font-mono tracking-wider">
                {modelCode ?? ""}
              </p>
            </div>
          </div>

          {totalUnits !== undefined && (
            <div className="flex flex-row gap-4">
              <div className="flex gap-2">
                <p className="font-semibold">{totalUnits}</p>
                <p className="text-accent-foreground/50">Unit</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold">{availableUnits}</p>
                <p className="text-accent-foreground/50">Tersedia</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold">{goodUnits}</p>
                <p className="text-accent-foreground/50">Kondisi Baik</p>
              </div>
            </div>
          )}
        </>
        <p className="text-sm font-semibold">Informasi</p>
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onEditClick}
            disabled={!item}
          >
            <IconPencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <DetailGrid rows={infoRows} />
    </div>
  );
}
