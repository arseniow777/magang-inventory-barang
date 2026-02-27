interface ItemTitleStatsProps {
  itemName?: string;
  modelCode?: string;
  totalUnits?: number;
  availableUnits?: number;
  goodUnits?: number;
}

export function ItemTitleStats({
  itemName,
  modelCode,
  totalUnits,
  availableUnits,
  goodUnits,
}: ItemTitleStatsProps) {
  return (
    <>
      <div className="flex w-full items-center mb-5">
        <div>
          <h1 className="text-3xl font-semibold leading-tight mb-2">
            {itemName ?? "—"}
          </h1>
          <p className="text-md text-muted-foreground font-mono tracking-wider">
            {modelCode ?? ""}
          </p>
        </div>
      </div>

      {/* {totalUnits !== undefined && (
        <div className="flex flex-row gap-4">
          <div className="flex gap-2">
            <p className="font-semibold">{totalUnits}</p>
            <p className="text-accent-foreground/50">Unit</p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold">{availableUnits}</p>
            <p className="text-accent-foreground/50">Tersedia</p>
          </div>
          <div className="flex gap-2">
            <p className="font-semibold">{goodUnits}</p>
            <p className="text-accent-foreground/50">Kondisi Baik</p>
          </div>
        </div>
      )} */}
    </>
  );
}
