import AktivitasTerbaru from "./AktivitasTerbaru";
import PermintaanTerbaru from "./PermintaanTerbaru";
import InformasiSekilas from "./InformasiSekilas";
import TombolCepat from "./TombolCepat";
import KondisiBarang from "./KondisiBarang";

export default function BerandaList() {
  return (
    <div className="flex flex-col gap-5 w-full md:h-full md:overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
        <InformasiSekilas />
        <PermintaanTerbaru />
        <TombolCepat />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:flex-1 md:min-h-0 md:overflow-hidden">
        <div className="md:col-span-2 md:h-full md:min-h-0 md:overflow-hidden">
          <AktivitasTerbaru />
        </div>
        <div className="bg-muted/50 rounded-xl p-4 md:h-full md:min-h-0 md:overflow-hidden">
          <KondisiBarang />
        </div>
      </div>
    </div>
  );
}
