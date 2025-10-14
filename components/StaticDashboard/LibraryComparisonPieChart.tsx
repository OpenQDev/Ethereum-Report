"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface LibraryComparisonData {
  solmate: {
    count: number;
    percentage: number;
  };
  solady: {
    count: number;
    percentage: number;
  };
}

interface LibraryComparisonPieChartProps {
  data: LibraryComparisonData;
  title: string;
  description: string;
}

export function LibraryComparisonPieChart({
  data,
  title,
  description,
}: LibraryComparisonPieChartProps) {
  const chartData = [
    {
      library: "Solmate",
      repositories: data.solmate.count,
      fill: "hsl(var(--chart-2))",
    },
    {
      library: "Solady",
      repositories: data.solady.count,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const chartConfig = {
    repositories: {
      label: "Repositories",
    },
    solmate: {
      label: "Solmate",
      color: "hsl(var(--chart-2))",
    },
    solady: {
      label: "Solady",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const totalRepositories = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.repositories, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="repositories"
              nameKey="library"
              innerRadius={60}
              strokeWidth={5}
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
                          {totalRepositories.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Repositories
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: "hsl(var(--chart-2))" }}
              />
              <span className="text-sm font-medium">Solmate</span>
            </div>
            <div className="text-2xl font-bold">
              {data.solmate.count.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {data.solmate.percentage.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: "hsl(var(--chart-3))" }}
              />
              <span className="text-sm font-medium">Solady</span>
            </div>
            <div className="text-2xl font-bold">
              {data.solady.count.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {data.solady.percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
