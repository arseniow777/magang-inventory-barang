import AktivitasTerbaru from "./AktivitasTerbaru";
import PermintaanTerbaru from "./PermintaanTerbaru";
import InformasiSekilas from "./InformasiSekilas";
import TombolCepat from "./TombolCepat";
import KondisiBarang from "./KondisiBarang";

export default function BerandaList() {
  return (
    <div className="flex flex-col gap-5 h-full w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
        <InformasiSekilas />
        <PermintaanTerbaru />
        <TombolCepat />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 min-h-0 overflow-hidden">
        <div className="md:col-span-2 h-full min-h-0 overflow-hidden">
          <AktivitasTerbaru />
        </div>
        {/* <div className="bg-muted/50 rounded-xl p-4 h-full min-h-0 overflow-hidden">
          <KondisiBarang />
        </div> */}
      </div>
    </div>
  );
}
