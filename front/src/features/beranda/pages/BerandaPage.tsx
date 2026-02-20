export default function BerandaPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 h-screen overflow-hidden">
      <div className="grid grid-cols-3 gap-5 flex-1">
        <div className="bg-muted/50 rounded-xl">Informais Sekilas</div>
        <div className="bg-muted/50 rounded-xl">Permintaan Terbaru</div>
        <div className="bg-muted/50 rounded-xl">Tombol cepat</div>
      </div>
      <div className="grid grid-cols-3 gap-5 flex-1">
        <div className="bg-muted/50 rounded-xl col-span-2">
          Aktivitas Terbaru
        </div>
        <div className="bg-muted/50 rounded-xl">Status sistem</div>
      </div>
    </div>
  );
}
