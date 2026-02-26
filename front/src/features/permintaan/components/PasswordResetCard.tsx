import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconUser, IconKey } from "@tabler/icons-react";

import type { PasswordResetData } from "../types/passwordReset.types";
import { usePasswordResetAction } from "../hooks/usePasswordResetAction";

// ── helpers ──────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

function statusClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200";
    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200";
    default:
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200";
  }
}

// ── component ─────────────────────────────────────────────────────────
interface PasswordResetCardProps {
  data: PasswordResetData;
}

export default function PasswordResetCard({ data }: PasswordResetCardProps) {
  const { approve, reject } = usePasswordResetAction();

  const isPending = data.status === "pending";

  const timeAgo = formatDistanceToNow(new Date(data.created_at), {
    addSuffix: true,
    locale: localeId,
  });

  return (
    <Card size="sm" className="mx-auto w-full bg-accent/20">
      <CardHeader className="py-0">
        <CardTitle className="font-mono text-xl">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <IconKey size={18} />
              <p className="truncate tracking-wider text-base">
                Reset Password
              </p>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 text-xs ${statusClass(data.status)}`}
            >
              {STATUS_LABEL[data.status] ?? data.status}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <IconUser size={15} />
              <p>{data.user.name}</p>
            </div>
            <p>{timeAgo}</p>
          </div>
        </CardDescription>
      </CardHeader>

      <Separator />

      {/* ── Info pengguna ── */}
      <CardContent>
        <p className="text-xs text-muted-foreground mb-1">Informasi Pengguna</p>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <p className="text-muted-foreground text-xs">Username</p>
            <p className="font-medium text-xs">{data.user.username}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground text-xs">Employee ID</p>
            <p className="font-medium text-xs">{data.user.employee_id}</p>
          </div>
        </div>
      </CardContent>

      <Separator />

      {/* ── Via ── */}
      <CardContent>
        <div className="flex justify-between text-sm">
          <p className="text-muted-foreground text-xs">Diajukan via</p>
          <p className="font-medium text-xs">Telegram</p>
        </div>
      </CardContent>

      {data.admin && (
        <>
          <Separator />
          <CardContent>
            <div className="flex justify-between text-sm">
              <p className="text-muted-foreground text-xs">Diproses oleh</p>
              <p className="font-medium text-xs">{data.admin.name}</p>
            </div>
          </CardContent>
        </>
      )}

      <Separator />

      <CardFooter>
        <div className="flex justify-end items-center w-full gap-2">
          {isPending && (
            <>
              <Button
                size="sm"
                onClick={() => approve.mutate(data.id)}
                disabled={approve.isPending || reject.isPending}
              >
                Setujui
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => reject.mutate(data.id)}
                disabled={approve.isPending || reject.isPending}
              >
                Tolak
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
