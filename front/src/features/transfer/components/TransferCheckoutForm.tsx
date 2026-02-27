import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useLocationsTransfer } from "../hooks/useLocationsTransfer";
import {
  transferFormSchema,
  type TransferFormValues,
} from "../schemas/transfer.schema";
import type { ReportType } from "../types/transfer.types";
import { TYPES_WITH_DESTINATION } from "../types/transfer.types";

const REQUEST_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: "borrow", label: "Peminjaman" },
  { value: "transfer", label: "Transfer" },
  { value: "sell", label: "Penjualan" },
  { value: "demolish", label: "Penghapusan" },
];

interface TransferCheckoutFormProps {
  onSubmit: (values: TransferFormValues) => void;
  isPending: boolean;
}

export function TransferCheckoutForm({
  onSubmit,
  isPending,
}: TransferCheckoutFormProps) {
  const { data: locations = [], isLoading: locationsLoading } =
    useLocationsTransfer();

  const [requestType, setRequestType] = useState<ReportType | "">("");
  const [locationId, setLocationId] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransferFormValues, string>>
  >({});

  const needsDest =
    requestType !== "" &&
    TYPES_WITH_DESTINATION.includes(requestType as ReportType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = transferFormSchema.safeParse({
      request_type: requestType,
      destination_location_id: locationId ? Number(locationId) : undefined,
      reason,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TransferFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TransferFormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Request type */}
      <div className="space-y-1.5">
        <Label htmlFor="request-type">Jenis Permintaan</Label>
        <Select
          value={requestType}
          onValueChange={(v) => {
            setRequestType(v as ReportType);
            // Clear destination if new type doesn't need it
            if (!TYPES_WITH_DESTINATION.includes(v as ReportType)) {
              setLocationId("");
            }
            setErrors((prev) => ({ ...prev, request_type: undefined }));
          }}
        >
          <SelectTrigger id="request-type" className="w-full">
            <SelectValue placeholder="Pilih jenis permintaan" />
          </SelectTrigger>
          <SelectContent>
            {REQUEST_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.request_type && (
          <p className="text-xs text-destructive">{errors.request_type}</p>
        )}
      </div>

      {/* Destination location — only for borrow / transfer */}
      {needsDest && (
        <div className="space-y-1.5">
          <Label htmlFor="destination">Lokasi Tujuan</Label>
          <Select
            value={locationId}
            onValueChange={(v) => {
              setLocationId(v ?? "");
              setErrors((prev) => ({
                ...prev,
                destination_location_id: undefined,
              }));
            }}
            disabled={locationsLoading}
          >
            <SelectTrigger id="destination" className="w-full">
              <SelectValue
                placeholder={
                  locationsLoading ? "Memuat lokasi..." : "Pilih lokasi tujuan"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem
                  key={loc.id}
                  value={String(loc.id)}
                  label={loc.building_name}
                >
                  {loc.building_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.destination_location_id && (
            <p className="text-xs text-destructive">
              {errors.destination_location_id}
            </p>
          )}
        </div>
      )}

      {/* Reason */}
      <div className="space-y-1.5">
        <Label htmlFor="reason">Alasan</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setErrors((prev) => ({ ...prev, reason: undefined }));
          }}
          placeholder="Contoh: Dibutuhkan di ruang meeting lantai 3"
          rows={4}
          className="resize-none"
        />
        {errors.reason && (
          <p className="text-xs text-destructive">{errors.reason}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Mengajukan...
          </span>
        ) : (
          "Ajukan Permintaan"
        )}
      </Button>
    </form>
  );
}
