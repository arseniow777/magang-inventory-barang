import LokasiList from "../components/LokasiList";

export default function LokasiPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daftar Lokasi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola lokasi penyimpanan barang
          </p>
        </div>
      </div>
      <LokasiList></LokasiList>
    </div>
  );
}
