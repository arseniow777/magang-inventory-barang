import { QRCodeSVG } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import DetailGrid from "../DetailGrid";
import type {
  ItemMasterDetail,
  ItemUnitsWithLocation,
} from "../../types/barang.types";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
} from "../item-badge-helpers";

interface UnitInfoPanelProps {
  item?: ItemMasterDetail;
  unit: ItemUnitsWithLocation | null;
  qrValue: string;
}

export function UnitInfoPanel({ item, unit, qrValue }: UnitInfoPanelProps) {
  const infoRows = [
    { label: "Nama Barang", value: item?.name ?? "—" },
    {
      label: "Kode Unit",
      value: <span className="font-mono">{unit?.unit_code ?? "—"}</span>,
    },
    {
      label: "Kondisi",
      value: unit ? (
        <Badge variant={conditionVariant[unit.condition]}>
          {conditionLabel[unit.condition]}
        </Badge>
      ) : (
        "—"
      ),
    },
    {
      label: "Status",
      value: unit ? (
        <Badge variant={statusVariant[unit.status]}>
          {statusLabel[unit.status]}
        </Badge>
      ) : (
        "—"
      ),
    },
    { label: "Gedung", value: unit?.location.building_name ?? "—" },
    {
      label: "Lantai",
      value: unit?.location.floor != null ? `Lt. ${unit.location.floor}` : "—",
    },
    { label: "Alamat", value: unit?.location.address ?? "—" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
      <div className="flex-1">
        <DetailGrid rows={infoRows} />
      </div>

      {qrValue && (
        <div className="grid grid-cols-2 items-start gap-4 lg:flex lg:flex-col">
          <div className="text-sm font-medium lg:hidden">QR Code</div>
          <div className="flex flex-col items-start lg:items-start">
            <div className="h-auto aspect-square rounded-xs border p-2 bg-white flex items-center justify-center">
              <QRCodeSVG value={qrValue} className="w-auto h-auto" />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono mt-1.5">
              {unit?.unit_code ?? ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
