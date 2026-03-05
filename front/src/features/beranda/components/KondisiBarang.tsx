"use client";

import React from "react";
import { Pie, PieChart, Label, ResponsiveContainer } from "recharts";
// import { type PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useItemConditionSummary } from "@/features/barang/hooks/useBarangItems";
import { EmptyState } from "@/components/empty-state";

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

  // const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
  //   undefined,
  // );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-base font-semibold">Kondisi Barang</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Memuat data...
        </div>
      ) : total === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState description="Tidak ada barang" />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex w-full">
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full h-full flex items-center justify-center"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="jumlah"
                  nameKey="kondisiBarang"
                  innerRadius="60%"
                  outerRadius="95%"
                >
                  <Label
                    content={({ viewBox }) => {
                      if (
                        viewBox &&
                        "cx" in viewBox &&
                        "cy" in viewBox &&
                        "innerRadius" in viewBox &&
                        viewBox.innerRadius
                      ) {
                        const cx = viewBox.cx ?? 0;
                        const cy = viewBox.cy ?? 0;
                        const innerRadius = viewBox.innerRadius;

                        const fontSize = innerRadius * 0.5;
                        const subFontSize = innerRadius * 0.2;

                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={cx}
                              y={cy}
                              fontSize={fontSize}
                              fontWeight="bold"
                              fill="currentColor"
                            >
                              {total.toLocaleString()}
                            </tspan>

                            <tspan
                              x={cx}
                              y={cy + subFontSize + 8}
                              fontSize={subFontSize}
                              fill="var(--muted-foreground)"
                            >
                              Total Unit
                            </tspan>
                          </text>
                        );
                      }

                      return null;
                    }}
                  />
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="kondisiBarang" />}
                  className="flex-wrap *:basis-1/3 *:justify-center pb-2"
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  );
}
