import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

interface ItemPageShellProps {
  onBack: () => void;
  name?: string;
  subtitle?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  /** Content rendered in the left column (1/3 width on lg) */
  left: ReactNode;
  /** Content rendered in the right column (2/3 width on lg) */
  right: ReactNode;
}

export default function ItemPageShell({
  onBack,
  name,
  subtitle,
  isError,
  errorMessage = "Gagal memuat data. Silakan coba lagi.",
  left,
  right,
}: ItemPageShellProps) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="w-full flex flex-col md:flex-row gap-8">
        <Button variant="outline" size="sm" onClick={onBack}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>

        <div className="w-full">
          {/* ── Header ── */}
          <div className="flex items-center mb-5">
            <div>
              <h1 className="text-2xl font-semibold leading-tight mb-1">
                {name ?? "—"}
              </h1>
              <p className="text-sm text-muted-foreground font-mono tracking-wider">
                {subtitle ?? "—"}
              </p>
            </div>
          </div>

          {/* ── Error state ── */}
          {isError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4">
              {errorMessage}
            </div>
          )}

          {/* ── 3-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">{left}</div>
            <div className="lg:col-span-2 space-y-5">{right}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
