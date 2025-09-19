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

interface Developer {
  internal_id: number;
  login: string;
  name: {
    String: string;
    Valid: boolean;
  };
  avatar_url: {
    String: string;
    Valid: boolean;
  };
  location: {
    String: string;
    Valid: boolean;
  };
  company: {
    String: string;
    Valid: boolean;
  };
  unique_repos: number;
  total_commits: number;
}

interface TopDevelopersChartProps {
  developers: Developer[];
  title?: string;
  description?: string;
}

const chartConfig = {
  commits: {
    label: "Total Commits",
    color: "hsl(var(--chart-1))",
  },
  repos: {
    label: "Unique Repos",
    color: "hsl(var(--chart-2))",
  },
};

export default function TopDevelopersChart({
  developers,
  title = "Top Developers by Activity",
  description = "Showing the most active developers by total commits and unique repositories",
}: TopDevelopersChartProps) {
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
    if (isMobile) return 10; // Mobile shows fewer in list format
    if (isXlScreen) return 15; // XL+ screens can show more
    return 10; // Medium screens (tablets) show fewer to prevent overlap
  };

  const displayCount = getDisplayCount();
  const topDevelopers = developers.slice(0, displayCount);

  const chartData = topDevelopers
    .map((dev, index) => ({
      rank: index + 1,
      developer: dev.login || dev.name.String || `Developer ${index + 1}`,
      commits: dev.total_commits,
      repos: dev.unique_repos,
      fullName: dev.name.String,
      location: dev.location.String,
      company: dev.company.String,
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
                Top {displayCount} developers ranked by activity
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto overscroll-y-contain developers-scroll">
              {chartData.map((item, index) => {
                const maxCommits = Math.max(...chartData.map((d) => d.commits));
                const maxRepos = Math.max(...chartData.map((d) => d.repos));

                const commitsPercentage =
                  maxCommits > 0 ? (item.commits / maxCommits) * 100 : 0;
                const reposPercentage =
                  maxRepos > 0 ? (item.repos / maxRepos) * 100 : 0;

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
                          <span className=" text-xs">{item.developer}</span>
                        </div>
                        {(item.fullName || item.company || item.location) && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {[item.fullName, item.company, item.location]
                              .filter(Boolean)
                              .join(" • ")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Commits */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          📝 Commits
                        </span>
                        <span className="">
                          {item.commits.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${commitsPercentage}%`,
                            backgroundColor: chartConfig.commits.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Unique Repos */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          📚 Unique Repos
                        </span>
                        <span className="">{item.repos.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${reposPercentage}%`,
                            backgroundColor: chartConfig.repos.color,
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
      <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className={`h-[${isMobile ? "300" : "400"}px] w-full`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: isXlScreen ? 30 : 10,
                left: isXlScreen ? 20 : 10,
                bottom: isXlScreen ? 60 : 100, // More bottom space for smaller screens
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="developer"
                angle={-45}
                textAnchor="end"
                height={isXlScreen ? 80 : 120} // More height for smaller screens
                fontSize={isXlScreen ? 12 : 10} // Smaller font on smaller screens
                interval={0}
                tickFormatter={(value) => {
                  if (!isXlScreen && value.length > 8) {
                    return value.slice(0, 8) + "...";
                  }
                  return value;
                }}
              />
              <YAxis
                fontSize={isXlScreen ? 12 : 11}
                tickFormatter={(value) => {
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
                          <div className="font-semibold">{dev.developer}</div>
                          {dev.fullName && (
                            <div className="text-sm text-muted-foreground">
                              {dev.fullName}
                            </div>
                          )}
                          {dev.location && (
                            <div className="text-sm text-muted-foreground">
                              📍 {dev.location}
                            </div>
                          )}
                          {dev.company && (
                            <div className="text-sm text-muted-foreground">
                              🏢 {dev.company}
                            </div>
                          )}
                          <div className="text-sm">
                            <div>
                              📊 Total Commits: {dev.commits.toLocaleString()}
                            </div>
                            <div>📁 Unique Repos: {dev.repos}</div>
                          </div>
                        </div>,
                      ];
                    }}
                  />
                }
              />
              <Bar
                dataKey="commits"
                fill="var(--color-commits)"
                name="Total Commits"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="commits"
                  position="top"
                  className="fill-gray-700 dark:fill-gray-300"
                  fontSize={isXlScreen ? 11 : 9} // Smaller font for smaller screens
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
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
