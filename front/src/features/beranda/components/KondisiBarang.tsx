"use client";

import React from "react";
import { Pie, PieChart, Label } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useItemConditionSummary } from "@/features/barang/hooks/useBarangItems";

const chartConfig = {
  kondisiBarang: {
    label: "Kondisi Barang",
  },
  baik: {
    label: "Baik",
    color: "var(--chart-1)",
  },
  rusakRingan: {
    label: "Rusak Ringan",
    color: "var(--chart-3)",
  },
  rusakBerat: {
    label: "Rusak Berat",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export default function KondisiBarang() {
  const { data, isLoading } = useItemConditionSummary();

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [
      { kondisiBarang: "baik", jumlah: data.good, fill: "var(--chart-2)" },
      {
        kondisiBarang: "rusakRingan",
        jumlah: data.damaged,
        fill: "var(--chart-4)",
      },
      {
        kondisiBarang: "rusakBerat",
        jumlah: data.broken,
        fill: "var(--chart-5)",
      },
    ];
  }, [data]);

  const total = React.useMemo(() => {
    if (!data) return 0;
    return data.good + data.damaged + data.broken;
  }, [data]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-base font-semibold">Kondisi Barang</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Memuat data...
        </div>
      ) : (
        <div className="flex-1 overflow-auto min-h-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="jumlah"
                nameKey="kondisiBarang"
                innerRadius={60}
                outerRadius={100}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Unit
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="kondisiBarang" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
}
