"use client";

import { useMobileDetection } from "../../hooks/useMobileDetection";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DeveloperByStars {
  login: string;
  total_stars: string;
}

interface TopDevelopersByStarsChartProps {
  developers: DeveloperByStars[];
  title?: string;
  description?: string;
}

const chartConfig = {
  stars: {
    label: "Total Stars",
    color: "hsl(var(--chart-3))",
  },
};

export default function TopDevelopersByStarsChart({
  developers,
  title = "Top Developers by Stars",
  description = "Showing the most starred developers based on their GitHub repositories",
}: TopDevelopersByStarsChartProps) {
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

  // Responsive developer count based on screen size
  const getDisplayCount = () => {
    if (isMobile) return developers.length; // Mobile shows all in list format
    if (isXlScreen) return 15; // XL+ screens can show more
    return 10; // Medium screens (tablets) show fewer to prevent overlap
  };

  const displayCount = getDisplayCount();
  const topDevelopers = developers.slice(0, displayCount);

  const chartData = topDevelopers
    .map((dev, index) => ({
      rank: index + 1,
      developer: dev.login || `Developer ${index + 1}`,
      stars: parseInt(dev.total_stars) || 0,
      starsFormatted: parseInt(dev.total_stars).toLocaleString(),
      fill: `hsl(var(--chart-${(index % 15) + 1}))`,
    }))
    .filter((dev) => dev.developer !== "");

  if (isMobile) {
    return (
      <div className="mb-6 sm:mb-8">
        <Card className="transition-all duration-200">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">
                Top {displayCount} developers ranked by GitHub stars
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-4">
            <div className="space-y-3 max-h-[500px] overflow-y-auto overscroll-y-contain developers-scroll">
              {chartData.map((item, index) => {
                const maxStars = Math.max(...chartData.map((d) => d.stars));
                const starsPercentage =
                  maxStars > 0 ? (item.stars / maxStars) * 100 : 0;

                return (
                  <div
                    key={`dev-${index}-${item.developer}`}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex-1 mr-2">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            #{index + 1}
                          </span>{" "}
                          <span className="text-xs">{item.developer}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          ⭐ Total Stars
                        </span>
                        <span className="font-semibold">
                          {item.starsFormatted}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${starsPercentage}%`,
                            backgroundColor: chartConfig.stars.color,
                          }}
                        />
                      </div>
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

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: isXlScreen ? 30 : 10,
                left: isXlScreen ? 20 : 10,
                bottom: isXlScreen ? 80 : 120, // More bottom space for labels
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="developer"
                angle={-45}
                textAnchor="end"
                height={isXlScreen ? 100 : 140} // More height for rotated labels
                fontSize={isXlScreen ? 11 : 9} // Smaller font for better fit
                interval={0}
                tickFormatter={(value) => {
                  if (!isXlScreen && value.length > 10) {
                    return value.slice(0, 10) + "...";
                  }
                  return value;
                }}
              />
              <YAxis
                fontSize={isXlScreen ? 12 : 11}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  }
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}k`;
                  }
                  return value;
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const dev = props.payload;
                      return [
                        <div key="tooltip" className="space-y-1">
                          <div className="font-semibold">@{dev.developer}</div>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <span>⭐</span>
                              <span>Total Stars: {dev.starsFormatted}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Rank #{dev.rank} of {developers.length}
                            </div>
                          </div>
                        </div>,
                      ];
                    }}
                  />
                }
              />
              <Bar
                dataKey="stars"
                fill="var(--color-stars)"
                name="Total Stars"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="stars"
                  position="top"
                  className="fill-gray-700 dark:fill-gray-300"
                  fontSize={isXlScreen ? 10 : 8} // Even smaller font for many bars
                  fontWeight="500"
                  formatter={(value: number) => {
                    // Format large numbers for better readability
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    }
                    if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}k`;
                    }
                    return value;
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
