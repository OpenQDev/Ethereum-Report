"use client";

import { useMobileDetection } from "../../hooks/useMobileDetection";
import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  LabelList,
} from "recharts";

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
  ChartTooltipContent,
  ChartTooltip,
} from "../ui/chart";

// Custom tooltip content with more spacing
const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border/50 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: data.payload.fill }}
            />
            <span className="text-sm text-muted-foreground">Projects</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {data.value.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function DependenciesBarChart({
  dependencies,
  title,
  description,
  top,
}: {
  dependencies: { dependency_name: string; count: number }[];
  title: string;
  description: string;
  top: number;
}) {
  const isMobile = useMobileDetection();

  // Hook to detect screen size for xl breakpoint (1280px)
  const [isXlScreen, setIsXlScreen] = useState(false);

  useEffect(() => {
    const checkIsXlScreen = () => {
      setIsXlScreen(window.innerWidth >= 1280);
    };

    checkIsXlScreen();
    window.addEventListener("resize", checkIsXlScreen);

    return () => window.removeEventListener("resize", checkIsXlScreen);
  }, []);

  // Responsive display count based on screen size
  const getDisplayCount = () => {
    if (isMobile) return Math.min(top, 15); // Mobile shows fewer items
    if (isXlScreen) return Math.min(top, 20); // XL+ screens can show more
    return Math.min(top, 12); // Medium screens show fewer to prevent overlap
  };

  const displayCount = getDisplayCount();

  const chartData = dependencies
    .map((dependency, index) => {
      const colorIndex = (index % 15) + 1; // Cycle through colors 1-15
      return {
        dependency_name: dependency.dependency_name,
        projects: dependency.count,
        fill: `hsl(var(--chart-${colorIndex}))`,
      };
    })
    .slice(0, displayCount);

  const chartConfig: ChartConfig = {
    projects: {
      label: "Projects",
    },
  };

  // Calculate dynamic width based on number of items and screen size
  const minBarWidth = isMobile ? 60 : isXlScreen ? 140 : 120; // Responsive bar width
  const chartWidth = Math.max(
    isMobile ? 320 : isXlScreen ? 900 : 700,
    chartData.length * minBarWidth
  );

  if (isMobile) {
    // Mobile layout: Compact list with progress bars
    return (
      <div className="mb-6 sm:mb-8">
        <Card className="transition-all duration-200">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">
                Top {displayCount} {title.toLowerCase()}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto overscroll-y-contain dependencies-scroll">
              {chartData.map((item, index) => {
                const maxValue = Math.max(...chartData.map((d) => d.projects));
                const percentage = (item.projects / maxValue) * 100;

                return (
                  <div
                    key={`dep-${index}-${item.dependency_name}`}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground truncate flex-1 mr-2">
                        #{index + 1} {item.dependency_name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {item.projects >= 1000
                          ? `${(item.projects / 1000).toFixed(0)}k`
                          : item.projects}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.fill,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop layout: Original bar chart
  return (
    <div className="mb-6 sm:mb-8">
      <Card className="transition-all duration-200">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
          {/* Scrollable container */}
          <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[300px]"
              style={{ width: `${chartWidth}px` }}
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                width={chartWidth}
                margin={{
                  top: 30,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="dependency_name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={isXlScreen ? 12 : 11}
                  tickFormatter={(value: string) => {
                    const maxLength = isXlScreen ? 18 : 14;
                    return value.length > maxLength
                      ? value.slice(0, maxLength) + "…"
                      : value;
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<CustomTooltipContent />}
                />

                <Bar
                  dataKey="projects"
                  strokeWidth={2}
                  radius={8}
                  barSize={70}
                  activeIndex={2}
                  activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        className={props.payload.fill}
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    );
                  }}
                >
                  <LabelList
                    dataKey="projects"
                    position="top"
                    className="fill-gray-700 dark:fill-gray-300"
                    fontSize={isXlScreen ? 11 : 9}
                    fontWeight="500"
                    formatter={(value: number) => {
                      // Format large numbers for better readability
                      if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}k`;
                      }
                      return value;
                    }}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
