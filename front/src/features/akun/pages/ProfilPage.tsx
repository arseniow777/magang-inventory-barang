import { ProfilAkun } from "../components/ProfilAkun";

export default function ProfilPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Informasi Pribadi</h2>
      </div>
      <ProfilAkun />
    </div>
  );
}