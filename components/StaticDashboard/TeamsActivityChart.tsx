import * as React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  // type ChartData,
} from "chart.js";
import { useMobileDetection } from "../../hooks/useMobileDetection";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import Data from "../../public/data.json";

export default function TeamsActivityChart({
  months,
  title,
}: Readonly<{
  months: string[];
  title: string;
}>) {
  const isMobile = useMobileDetection();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    BarElement,
    Tooltip
  );

  const monthlyRepoStats = (Data?.monthlyRepoStats ?? {}) as any;

  const totalCommits = months.map(
    (month) => monthlyRepoStats?.[month]?.totalCommits ?? 0
  );

  const activeProjects = months.map(
    (month) => monthlyRepoStats?.[month]?.activeProjects ?? 0
  );

  const chartData = React.useMemo(() => {
    return months.map((month, index) => ({
      date: month,
      commits: totalCommits[index] || 0,
      teams: activeProjects[index] || 0,
    }));
  }, [months, totalCommits, activeProjects]);

  const chartConfig = {
    visitors: {
      label: "Activity",
    },
    commits: {
      label: "Commits",
      color: "hsla(210, 100%, 75%, 0.75)", // Light blue
    },
    teams: {
      label: "Teams",
      color: "hsla(270, 100%, 85%, 0.75)", // Light purple
    },
  } satisfies ChartConfig;

  return (
    <div className="mb-6 sm:mb-8">
      <Card
        className={`${
          isMobile ? "touch-pan-x" : ""
        } transition-all duration-200`}
      >
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className={`${isMobile ? "text-lg" : ""}`}>
              {title}
            </CardTitle>
            <CardDescription className={`${isMobile ? "text-sm" : ""}`}>
              Showing team activity and commits over time
            </CardDescription>
          </div>
        </CardHeader>

        <>
          <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
            <div
              className={`${
                isMobile ? "overflow-x-auto overscroll-x-contain" : ""
              }`}
            >
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] sm:h-[300px] lg:h-[350px] w-full"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: isMobile ? 15 : 30,
                    left: isMobile ? 15 : 30,
                    bottom: isMobile ? 20 : 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="fillCommits"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-commits)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-commits)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillTeams" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-teams)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-teams)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <pattern id="openq-logo-teams" patternUnits="userSpaceOnUse" width="100%" height="100%">
                      <image
                        href="/openq-logo.png"
                        x="50%"
                        y="50%"
                        width="100"
                        height="100"
                        opacity={0.5}
                        transform="translate(-50, -50)"
                      />
                    </pattern>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={isMobile ? 32 : 0}
                    tickFormatter={(value) => {
                      const date = new Date(value + "-01T00:00:00.000Z");
                      date.setUTCMonth(date.getUTCMonth() + 1);
                      const nextMonth = date.toISOString().slice(0, 7);

                      if (isMobile) {
                        const monthDate = new Date(nextMonth + "-01");
                        return monthDate.toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit",
                        });
                      }
                      return nextMonth;
                    }}
                    interval={isMobile ? "preserveStartEnd" : 0}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    height={isMobile ? 60 : 30}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={isMobile ? 4 : 8}
                    tickFormatter={(value) => {
                      if (isMobile && value >= 1000) {
                        return `${(value / 1000).toFixed(0)}k`;
                      }
                      return value.toFixed(0);
                    }}
                    label={
                      !isMobile
                        ? {
                            value: "Teams",
                            angle: -90,
                            position: "insideLeft",
                            offset: -20,
                            style: { textAnchor: "middle" },
                          }
                        : undefined
                    }
                    width={isMobile ? 40 : 60}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={isMobile ? 4 : 8}
                    tickFormatter={(value) => {
                      if (isMobile && value >= 1000) {
                        return `${(value / 1000).toFixed(0)}k`;
                      }
                      return value.toFixed(0);
                    }}
                    label={
                      !isMobile
                        ? {
                            value: "Commits",
                            angle: 90,
                            position: "insideRight",
                            offset: -15,
                            style: { textAnchor: "middle" },
                          }
                        : undefined
                    }
                    width={isMobile ? 40 : 60}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => value}
                        indicator="dot"
                        className="[&_span.font-medium]:ml-2"
                      />
                    }
                  />
                  <Area
                    yAxisId="right"
                    dataKey="commits"
                    type="linear"
                    fill="url(#fillCommits)"
                    stroke="var(--color-commits)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-commits)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    yAxisId="left"
                    dataKey="teams"
                    type="linear"
                    fill="url(#fillTeams)"
                    stroke="var(--color-teams)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-teams)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    wrapperStyle={isMobile ? { fontSize: "12px" } : {}}
                  />
                  <image
                    href="/openq-logo.png"
                    x="50%"
                    y="50%"
                    width="100"
                    height="100"
                    opacity={0.5}
                    transform="translate(-50, -50)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </>
      </Card>
    </div>
  );
}
