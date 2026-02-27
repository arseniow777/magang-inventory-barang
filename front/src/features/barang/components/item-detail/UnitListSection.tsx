import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { ItemUnitsWithLocation } from "../../types/barang.types";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
} from "../item-badge-helpers";

interface UnitListSectionProps {
  units: ItemUnitsWithLocation[];
  itemId?: number;
}

export function UnitListSection({ units, itemId }: UnitListSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold">
        Daftar Unit{" "}
        <span className="text-muted-foreground font-normal">
          ({units.length})
        </span>
      </p>

      {units.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Belum ada unit terdaftar.
        </p>
      ) : (
        <div className="max-h-[59vh] overflow-y-auto space-y-3 pr-2">
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => navigate(`/dashboard/barang/${itemId}/${unit.id}`)}
              className="w-full text-left flex items-center justify-between rounded-sm bg-accent/15 border border-border px-4 py-3 text-sm hover:bg-accent transition-colors cursor-pointer"
            >
              <div>
                <p className="font-mono font-medium text-sm">
                  {unit.unit_code}
                </p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {unit.location.building_name} · Lt. {unit.location.floor}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={conditionVariant[unit.condition]}>
                  {conditionLabel[unit.condition]}
                </Badge>
                <Badge variant={statusVariant[unit.status]}>
                  {statusLabel[unit.status]}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
