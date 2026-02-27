import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ItemUnitsWithLocation } from "../../types/barang.types";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
} from "../item-badge-helpers";

interface UnitDataTableProps {
  units: ItemUnitsWithLocation[];
  itemId?: number;
}

export function UnitDataTable({ units, itemId }: UnitDataTableProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">
        Daftar Unit{" "}
        <span className="text-muted-foreground font-normal">
          ({units.length})
        </span>
      </p>

      {units.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Belum ada unit terdaftar.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Kode Unit</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gedung</TableHead>
              <TableHead>Lantai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, index) => (
              <TableRow
                key={unit.id}
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/dashboard/barang/${itemId}/${unit.id}`)
                }
              >
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono font-medium">
                  {unit.unit_code}
                </TableCell>
                <TableCell>
                  <Badge variant={conditionVariant[unit.condition]}>
                    {conditionLabel[unit.condition]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[unit.status]}>
                    {statusLabel[unit.status]}
                  </Badge>
                </TableCell>
                <TableCell>{unit.location.building_name}</TableCell>
                <TableCell>Lt. {unit.location.floor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
