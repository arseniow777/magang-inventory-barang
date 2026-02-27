import BantuanList from "../components/BantuanList";

export default function BantuanPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bantuan</h1>
          <p className="text-muted-foreground text-sm">
            Pusat bantuan dan panduan penggunaan aplikasi
          </p>
        </div>
      </div>

      <BantuanList />
    </div>
  );
}
