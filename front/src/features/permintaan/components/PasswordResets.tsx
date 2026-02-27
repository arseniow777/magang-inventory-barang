import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsLine } from "@/components/tabs";
import { usePasswordResets } from "../hooks/usePasswordResets";
import PasswordResetCard from "./PasswordResetCard";
import type { PasswordResetData } from "../types/passwordReset.types";
import { EmptyState } from "@/components/empty-state";

const TABS = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

export default function PasswordResets() {
  const [activeStatus, setActiveStatus] = useState("pending");
  const { data: resets = [], isLoading } = usePasswordResets();

  const filtered = useMemo<PasswordResetData[]>(() => {
    if (activeStatus === "all") return resets;
    return resets.filter((r) => r.status === activeStatus);
  }, [resets, activeStatus]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Permintaan reset password yang diajukan pengguna via Telegram.
          </p>
        </div>
      </div>

      <div className="mb-2 w-full">
        <TabsLine
          tabs={TABS}
          activeTab={activeStatus}
          onTabChange={setActiveStatus}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada permintaan"
          description={`Tidak ada permintaan reset password${
            activeStatus !== "all"
              ? ` dengan status "${TABS.find((t) => t.value === activeStatus)?.label}"`
              : ""
          }`}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <PasswordResetCard key={r.id} data={r} />
          ))}
        </div>
      )}
    </div>
  );
}
