import type { ReactNode } from "react";

export interface DetailRow {
  label: string;
  value: ReactNode;
}

interface DetailGridProps {
  rows: DetailRow[];
}

export default function DetailGrid({ rows }: DetailGridProps) {
  return (
    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
      {rows.map((row, i) => (
        <div key={i} className="contents">
          <div className="text-muted-foreground w-fit">{row.label}</div>
          <div className="font-medium">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
