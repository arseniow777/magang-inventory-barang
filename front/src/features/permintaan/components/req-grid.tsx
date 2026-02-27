import { Skeleton } from "@/components/ui/skeleton";
import type { RequestData } from "../types/permintaan.types";
import ReqCard from "./req-card";
import { EmptyState } from "@/components/empty-state";

interface ReqGridProps {
  data: RequestData[];
  isLoading?: boolean;
}

export function ReqGrid({ data, isLoading }: ReqGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      // <p className="text-sm text-muted-foreground">Belum ada permintaan.</p>
      <EmptyState
        title="Belum ada permintaan"
        description="Tidak ada request yang dibuat oleh user"
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
      {data.map((req) => (
        <ReqCard key={req.id} data={req} />
      ))}
    </div>
  );
}
