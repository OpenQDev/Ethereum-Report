"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMobileDetection } from "@/hooks/useMobileDetection";

interface StarredRepository {
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
  total_commits: number;
}

interface LanguageDistributionChartProps {
  repositories: StarredRepository[];
  title?: string;
  description?: string;
  topLanguagesCount?: number;
}

const chartConfig = {
  count: {
    label: "Repositories",
    color: "hsl(var(--chart-1))",
  },
};

export default function LanguageDistributionChart({
  repositories,
  title = "Language Distribution",
  description = "Distribution of programming languages in top starred repositories",
  topLanguagesCount = 10,
}: LanguageDistributionChartProps) {
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

  // Language distribution data - filter out empty languages early
  const languageData = repositories.reduce((acc, repo) => {
    const lang = repo.language.Valid ? repo.language.String : "";
    // Skip repositories with empty or invalid language
    if (!lang || lang.trim() === "") {
      return acc;
    }

    const existing = acc.find((item) => item.language === lang);
    if (existing) {
      existing.count += 1;
      existing.stars += repo.stargazers_count.Valid
        ? repo.stargazers_count.Int32
        : 0;
    } else {
      acc.push({
        language: lang,
        count: 1,
        stars: repo.stargazers_count.Valid ? repo.stargazers_count.Int32 : 0,
      });
    }
    return acc;
  }, [] as { language: string; count: number; stars: number }[]);

  // Responsive language count based on screen size
  const getDisplayCount = () => {
    if (isMobile) return Math.min(topLanguagesCount, 8); // Mobile shows fewer languages
    if (isXlScreen) return topLanguagesCount; // XL+ screens can show all
    return Math.min(topLanguagesCount, 10); // Medium screens show moderate amount
  };

  const displayCount = getDisplayCount();

  // Sort by count and take top languages
  const topLanguages = languageData
    .filter((lang) => lang.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, displayCount);

  // Calculate total for percentages
  const totalRepositories = topLanguages.reduce(
    (sum, lang) => sum + lang.count,
    0
  );

  if (isMobile) {
    // Mobile layout: Compact list with progress bars
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="space-y-3">
            {topLanguages.map((language, index) => {
              const percentage = (language.count / totalRepositories) * 100;
              return (
                <div key={language.language} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: `hsl(var(--chart-${
                            (index % 15) + 1
                          }))`,
                        }}
                      />
                      <span className="font-medium">{language.language}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language.count} repos
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="rounded-full h-2 transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: `hsl(var(--chart-${
                          (index % 15) + 1
                        }))`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language.stars.toLocaleString()} total stars
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-4 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className={`flex-1 w-full h-[${
            isMobile ? "250" : isXlScreen ? "400" : "350"
          }px]`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topLanguages}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ language, count, percent }) => {
                  // Hide labels on smaller screens to avoid overlap
                  if (!isXlScreen && topLanguages.length > 6) {
                    return "";
                  }
                  return `${language} (${(percent * 100).toFixed(0)}%)`;
                }}
                outerRadius={isXlScreen ? 140 : isMobile ? 80 : 100}
                innerRadius={0}
                fill="#8884d8"
                dataKey="count"
              >
                {topLanguages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 15) + 1}))`}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) {
                    return null;
                  }

                  const data = payload[0].payload;
                  // Only show tooltip for valid languages
                  if (!data || !data.language || data.language.trim() === "") {
                    return null;
                  }

                  return (
                    <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
                      <div className="space-y-1">
                        <div className="font-semibold">{data.language}</div>
                        <div>Repositories: {data.count}</div>
                        <div>Total Stars: {data.stars.toLocaleString()}</div>
                        <div>
                          Percentage:{" "}
                          {((data.count / totalRepositories) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
