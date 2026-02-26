import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";
import DetailGrid from "../DetailGrid";
import type { ItemMasterDetail } from "../../types/barang.types";

interface ItemInfoPanelProps {
  item?: ItemMasterDetail;
  isAdmin: boolean;
  onEditClick: () => void;
}

export function ItemInfoPanel({
  item,
  isAdmin,
  onEditClick,
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
