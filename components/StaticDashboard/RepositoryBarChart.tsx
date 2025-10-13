"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
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
import { useMobileDetection } from "../../hooks/useMobileDetection";
import { useState, useEffect } from "react";

interface Repository {
  internal_id: number;
  github_rest_id: number;
  github_graphql_id: string;
  repo_url: {
    String: string;
    Valid: boolean;
  };
  name: string;
  full_name: string;
  owner_login: string;
  description: {
    String: string;
    Valid: boolean;
  };
  language: {
    String: string;
    Valid: boolean;
  };
  stargazers_count: {
    Int32: number;
    Valid: boolean;
  };
  forks_count: {
    Int32: number;
    Valid: boolean;
  };
  size: {
    Int32: number;
    Valid: boolean;
  };
  default_branch: {
    String: string;
    Valid: boolean;
  };
  total_commits?: number;
  active_days?: number;
  max_concurrent_authors?: number;
}

interface RepositoryBarChartProps {
  repositories: Repository[];
  title: string;
  description: string;
  dataKey: "commits" | "stars";
  showCommits?: boolean;
}

const chartConfig = {
  stars: {
    label: "Stars",
    color: "hsl(var(--chart-1))",
  },
  forks: {
    label: "Forks",
    color: "hsl(var(--chart-2))",
  },
  commits: {
    label: "Commits",
    color: "hsl(var(--chart-3))",
  },
};

export default function RepositoryBarChart({
  repositories,
  title,
  description,
  dataKey,
  showCommits = true,
}: RepositoryBarChartProps) {
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

  // Responsive repository count based on screen size
  const getDisplayCount = () => {
    if (isMobile) return repositories.length; // Mobile shows all in list format
    if (isXlScreen) return dataKey === "stars" ? 15 : 12; // XL+ screens can show more
    return dataKey === "stars" ? 10 : 8; // Medium screens (tablets) show fewer to prevent overlap
  };

  const displayCount = getDisplayCount();
  const topRepos = repositories.slice(0, displayCount);

  const chartData = topRepos
    .map((repo, index) => ({
      rank: index + 1,
      name:
        repo.name.length > (dataKey === "stars" ? 25 : 20)
          ? repo.name.substring(0, dataKey === "stars" ? 25 : 20) + "..."
          : repo.name,
      fullName: repo.full_name,
      owner: repo.owner_login,
      stars: repo.stargazers_count.Valid ? repo.stargazers_count.Int32 : 0,
      forks: repo.forks_count.Valid ? repo.forks_count.Int32 : 0,
      commits: repo.total_commits || 0,
      language: repo.language.Valid ? repo.language.String : "Unknown",
      description: repo.description.Valid ? repo.description.String : "",
      size: repo.size.Valid ? repo.size.Int32 : 0,
      activeDays: repo.active_days || 0,
      fill: `hsl(var(--chart-${(index % 15) + 1}))`,
    }))
    .filter(
      (repo) =>
        repo.name !== "" &&
        (!dataKey || dataKey === "stars" || repo.language.trim() !== "")
    );

  if (isMobile) {
    return (
      <div className="mb-6 sm:mb-8">
        <Card className="transition-all duration-200">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">
                All {repositories.length} repositories ranked by {dataKey}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto overscroll-y-contain repositories-scroll">
              {chartData.map((item, index) => {
                const maxStars = Math.max(...chartData.map((d) => d.stars));
                const maxForks = Math.max(...chartData.map((d) => d.forks));
                const maxCommits = Math.max(...chartData.map((d) => d.commits));

                const starsPercentage =
                  maxStars > 0 ? (item.stars / maxStars) * 100 : 0;
                const forksPercentage =
                  maxForks > 0 ? (item.forks / maxForks) * 100 : 0;
                const commitsPercentage =
                  maxCommits > 0 ? (item.commits / maxCommits) * 100 : 0;

                return (
                  <div key={`repo-${index}-${item.name}`} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex-1 mr-2">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            #{index + 1}
                          </span>{" "}
                          <span className=" text-xs">
                            {item.fullName || item.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.language} • {item.owner}
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          ⭐ Stars
                        </span>
                        <span className="">{item.stars.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${starsPercentage}%`,
                            backgroundColor: chartConfig.stars.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Forks */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          🍴 Forks
                        </span>
                        <span className="">{item.forks.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${forksPercentage}%`,
                            backgroundColor: chartConfig.forks.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Commits */}
                    {showCommits && (
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
                    )}
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
            <ComposedChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: isXlScreen ? 80 : 100, // More bottom space for smaller screens
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={isXlScreen ? 100 : 120} // More height for smaller screens
                fontSize={isXlScreen ? 11 : 10} // Smaller font on smaller screens
                interval={0} // Show all labels
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: dataKey === "commits" ? "Commits" : "Stars",
                  angle: -90,
                  position: "insideLeft",
                }}
                fontSize={isXlScreen ? 12 : 11}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                fontSize={isXlScreen ? 12 : 11}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const repo = props.payload;
                      return [
                        <div key="tooltip" className="space-y-2 max-w-xs">
                          <div className="font-semibold text-lg">
                            {repo.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            👤 {repo.owner}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            💻 {repo.language}
                          </div>
                          {repo.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {repo.description}
                            </div>
                          )}
                          <div className="text-sm space-y-1">
                            <div>⭐ Stars: {repo.stars.toLocaleString()}</div>
                            <div>🍴 Forks: {repo.forks.toLocaleString()}</div>
                            {showCommits && (
                              <div>
                                📝 Commits: {repo.commits.toLocaleString()}
                              </div>
                            )}
                            <div>📁 Size: {repo.size.toLocaleString()} KB</div>
                            {repo.activeDays > 0 && (
                              <div>📅 Active Days: {repo.activeDays}</div>
                            )}
                          </div>
                        </div>,
                      ];
                    }}
                  />
                }
              />
              <Bar
                yAxisId="left"
                dataKey={dataKey}
                fill={`var(--color-${dataKey})`}
                name={dataKey === "commits" ? "Commits" : "Stars"}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey={dataKey}
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
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
