import { useState } from "react";
import {
  IconPlus,
  IconBuildingCommunity,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { IconSearch } from "@tabler/icons-react";
import { useLokasiData, useDeleteLokasi } from "../hooks/usePermintaanData";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LocationData } from "../types/lokasi.types";
import { EmptyState } from "@/components/empty-state";

function LocationCard({ location }: { location: LocationData }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { mutate: deleteLokasi } = useDeleteLokasi();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);
    deleteLokasi(location.id, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["locations"] });
        toast.success("Lokasi berhasil dihapus");
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Gagal menghapus lokasi",
        ),
    });
  };

  return (
    <>
      <Card className="relative">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-muted">
              <IconBuildingCommunity className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight">
                {location.building_name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {location.address}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                <IconDotsVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/dashboard/lokasi/edit/${location.id}`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setOpen(true)}
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Kode lokasi:</span>
              <span className="font-medium">{location.location_code}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Lantai:</span>
              <Badge variant="outline" className="font-medium">
                {location.floor}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus lokasi ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Lokasi{" "}
              <span className="font-medium">{location.building_name}</span> akan
              dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function LokasiList() {
  const { data: locations = [], isLoading, error } = useLokasiData();

  const debugEmpty = false; //testing UI
  const dataToUse = debugEmpty ? [] : locations;

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = dataToUse.filter((l) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      l.building_name.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      l.location_code.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Gagal memuat data lokasi</p>
      </div>
    );
  }

  if (dataToUse.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
        <EmptyState
          icon={<IconBuildingCommunity />}
          title="Belum ada lokasi"
          description="Tambahkan lokasi pertama untuk mulai mengelola penyimpanan barang"
        />

        <Button onClick={() => navigate("/dashboard/lokasi/tambah")}>
          <IconPlus className="h-4 w-4 mr-2" />
          Tambah Lokasi
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-end gap-4">
        <ButtonGroup>
          <Input
            placeholder="Cari nama / kode / alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" aria-label="Search">
            <IconSearch />
          </Button>
        </ButtonGroup>
        <Button onClick={() => navigate("/dashboard/lokasi/tambah")}>
          <IconPlus className="h-4 w-4 mr-2" />
          Tambah Lokasi
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
}
