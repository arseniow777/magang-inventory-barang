import { useLokasiData } from "../hooks/usePermintaanData";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

export default function LokasiPage() {
  const { data: locations = [], isLoading, error } = useLokasiData();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daftar Lokasi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola lokasi penyimpanan barang
          </p>
        </div>
        <Button>
          <IconPlus className="h-4 w-4 mr-2" />
          Tambah Lokasi
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p>Memuat data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-red-500">Gagal memuat data lokasi</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
          <IconBuildingCommunity className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada lokasi</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tambahkan lokasi pertama untuk mulai mengelola penyimpanan barang
          </p>
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Tambah Lokasi
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card key={location.id} className="relative">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mt-1"
                    >
                      <IconDotsVertical className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Kode lokasi:</span>
                    <span className="font-medium">
                      {location.location_code}
                    </span>
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
          ))}
        </div>
      )}
    </div>
  );
}
