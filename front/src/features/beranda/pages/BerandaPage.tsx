import BerandaList from "../components/BerandaList";

export default function BerandaPage() {
  return (
    <div className="flex flex-col overflow-y-auto md:max-h-[calc(100vh-112px)] md:overflow-hidden">
      <BerandaList />
    </div>
  );
}
