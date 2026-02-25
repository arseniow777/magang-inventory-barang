import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { IconSearch, IconFilter2 } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortDir, SortField } from "../hooks/useBarangFilter";

interface ButtonGroupInputProps {
  search: string;
  onSearchChange: (v: string) => void;
  sortField: SortField;
  onSortFieldChange: (v: SortField) => void;
  sortDir: SortDir;
  onSortDirChange: (v: SortDir) => void;
}

export function ButtonGroupInput({
  search,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortDir,
  onSortDirChange,
}: ButtonGroupInputProps) {
  return (
    <div className="flex gap-2">
      <ButtonGroup>
        <Input
          placeholder="Cari nama / kode barang..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button variant="outline" aria-label="Search">
          <IconSearch />
        </Button>
      </ButtonGroup>

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline">
              <IconFilter2 />
              <p className="hidden lg:block">Urutkan</p>
            </Button>
          }
        />
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Urutkan Menurut</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortField}
              onValueChange={(v) => onSortFieldChange(v as SortField)}
            >
              <DropdownMenuRadioItem value="name">Nama</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="procurement_year">
                Tahun
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="created_at">
                Tanggal
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Arah</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortDir}
              onValueChange={(v) => onSortDirChange(v as SortDir)}
            >
              <DropdownMenuRadioItem value="asc">
                A → Z / Terlama
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">
                Z → A / Terbaru
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
