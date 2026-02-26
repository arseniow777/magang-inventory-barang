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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StatusFilter } from "../hooks/usePenggunaFilter";

interface ButtonGroupInputProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
}

export function ButtonGroupInput({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ButtonGroupInputProps) {
  return (
    <div className="flex gap-2">
      <ButtonGroup>
        <Input
          placeholder="Cari nama / username..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button variant="outline" aria-label="Search">
          <IconSearch />
        </Button>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline">
              <IconFilter2 />
              <p className="hidden lg:block">Filter</p>
            </Button>
          }
        />
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(v) => onStatusFilterChange(v as StatusFilter)}
            >
              <DropdownMenuRadioItem value="all">Semua</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">
                Aktif
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inactive">
                Nonaktif
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
