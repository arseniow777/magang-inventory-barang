import { usePermintaanData } from "../hooks/usePermintaanData";
import { usePermintaanFilter } from "../hooks/usePermintaanFilter";
import { ReqGrid } from "./req-grid";
import { TabsLine } from "@/components/tabs";
import { ButtonGroupInput } from "./group-button";
import { useAuthUser, Role } from "@/hooks/useAuthUser";

const ALL_TABS = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "all", label: "Semua" },
];

export default function Permintaan() {
  const { data: requests = [], isLoading } = usePermintaanData();
  const { data: authUser } = useAuthUser();
  const isAdmin = authUser?.role === Role.admin;
  const TABS = isAdmin ? ALL_TABS : ALL_TABS.filter((t) => t.value !== "all");
  const {
    activeStatus,
    filteredRequests,
    handleStatusChange,
    search,
    setSearch,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  } = usePermintaanFilter(requests);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Daftar permintaan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daftar permintaan yang diajukan oleh person in charge.
          </p>
        </div>
      </div>
      <div className="mb-2 w-full flex justify-between gap-4">
        <TabsLine
          tabs={TABS}
          activeTab={activeStatus}
          onTabChange={handleStatusChange}
        />
        <ButtonGroupInput
          search={search}
          onSearchChange={setSearch}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortDir={sortDir}
          onSortDirChange={setSortDir}
        />
      </div>
      <ReqGrid data={filteredRequests} isLoading={isLoading} />
    </div>
  );
}
