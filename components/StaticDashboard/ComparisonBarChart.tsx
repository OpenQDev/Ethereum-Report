"use client";

import { useMobileDetection } from "../../hooks/useMobileDetection";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

interface ComparisonData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export function ComparisonBarChart({
  data,
  title,
  description,
}: {
  data: ComparisonData[];
  title: string;
  description: string;
}) {
  const isMobile = useMobileDetection();

  const chartData = data.map((item) => ({
    name: item.name,
    count: item.count,
    fill: item.color,
  }));

  const chartConfig: ChartConfig = {
    count: {
      label: "Repositories",
    },
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className={`${isMobile ? "text-lg" : ""}`}>
            {title}
          </CardTitle>
          <CardDescription className={`${isMobile ? "text-sm" : ""}`}>
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6 flex-1 flex flex-col">
        <ChartContainer
          config={chartConfig}
          className="flex-1 w-full h-[300px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 30,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={isMobile ? 11 : 12}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="count" strokeWidth={2} radius={8}>
              <LabelList
                dataKey="count"
                position="top"
                className="fill-gray-700 dark:fill-gray-300"
                fontSize={isMobile ? 10 : 12}
                fontWeight="600"
                formatter={(value: number) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}k`;
                  }
                  return value.toLocaleString();
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
