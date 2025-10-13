import CommitSquare from "./CommitSquare";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Data from "../../public/data.json";
import { useMobileDetection } from "../../hooks/useMobileDetection";

export default function CommitSquaresChart({
  commitSquares,
  months,
}: Readonly<{
  commitSquares: Record<
    string,
    Record<string, { count: number; percentage: number }>
  >;
  months: string[];
}>) {
  const isMobile = useMobileDetection();
  const repoCount = parseInt(Data.repoCount.$numberLong);

  // Helper to shift a YYYY-MM string one month earlier, preserving format
  function shiftMonthEarlier(monthStr: string): string {
    const [yearStr, monthNumStr] = monthStr.split("-");
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthNumStr, 10);

    // Move to previous month, handle year wrap
    if (month === 1) {
      year -= 1;
      month = 12;
    } else {
      month -= 1;
    }

    // Always pad month to 2 digits
    return `${year}-${month.toString().padStart(2, "0")}`;
  }

  // Sort original months in chronological order for display
  const sortedMonths = months.sort((a, b) => {
    const dateA = new Date(a + "-01");
    const dateB = new Date(b + "-01");
    return dateA.getTime() - dateB.getTime(); // Earliest to latest
  });

  // Create shifted months for data lookup (keep same order as sortedMonths)
  const shiftedMonths = sortedMonths.map(shiftMonthEarlier);

  // For mobile, show all 12 months with horizontal scroll in chronological order
  const mobileMonths = sortedMonths; // All 12 months, earliest to latest (for display)
  const mobileShiftedMonths = shiftedMonths; // For data lookup

  // Helper function to extract repo name from URL
  const getRepoDisplayName = (repoUrl: string): string => {
    if (repoUrl.startsWith("https://github.com/")) {
      const parts = repoUrl.replace("https://github.com/", "").split("/");
      return `${parts[0]}/${parts[1]}`;
    }
    return repoUrl;
  };

  // Limit to top 75 on mobile, 500 on desktop
  const displayLimit = isMobile ? 75 : 500;
  const repoList = Object.keys(commitSquares).slice(0, displayLimit);
  const totalRepos = Object.keys(commitSquares).length;

  if (isMobile) {
    // Mobile layout: Vertical card-based layout
    return (
      <div className="mb-6 sm:mb-8">
        <Card className="touch-pan-y transition-all duration-200">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle className="text-lg">Team Activity Ranking</CardTitle>
              <CardDescription className="text-sm">
                Top {displayLimit} teams - 12 months activity
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-4 pt-4">
            <div className="max-h-[500px] overflow-y-auto space-y-3 overscroll-y-contain touch-pan-y commit-squares-scroll">
              {repoList.map((repo, index) => (
                <div
                  key={repo}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </span>{" "}
                      <span className=" text-xs">
                        {getRepoDisplayName(repo)}
                      </span>
                    </div>
                  </div>

                  {/* All 12 months - horizontal scroll */}
                  <div className="overflow-x-auto overscroll-x-contain touch-pan-x mb-2 team-activity-scroll pb-2">
                    {/* Month headers */}
                    <div className="flex gap-1 mb-1 text-xs text-gray-500 dark:text-gray-400 min-w-max">
                      {mobileMonths.map((month) => {
                        // Convert YYYY-MM to readable month
                        const [year, monthNum] = month.split("-");
                        const monthDate = new Date(
                          parseInt(year),
                          parseInt(monthNum) - 1
                        );
                        const monthName = monthDate.toLocaleDateString(
                          "en-US",
                          { month: "short" }
                        );
                        const yearShort = year.slice(-2);

                        return (
                          <div
                            key={month}
                            className="text-center w-6 flex-shrink-0"
                          >
                            {monthName} {yearShort}
                          </div>
                        );
                      })}
                    </div>

                    {/* Commit squares for all 12 months */}
                    <div className="flex gap-0.5 min-w-max">
                      {mobileMonths.map((month, monthIndex) => {
                        const shiftedMonth = mobileShiftedMonths[monthIndex];
                        return (
                          <div
                            key={`${repo}-${month}`}
                            className="flex justify-center w-6 flex-shrink-0"
                          >
                            <CommitSquare
                              commitsForCombo={
                                commitSquares?.[repo]?.[shiftedMonth] ?? {
                                  count: 0,
                                  percentage: 0,
                                }
                              }
                              large={false}
                              tooltip={true}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop layout: Original table layout
  return (
    <div className="mb-6 sm:mb-8">
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Team Activity Ranking</CardTitle>
            <CardDescription>
              Over the past 12 months{" "}
              {repoCount > 500 && <span>(Top 100 Teams)</span>}
            </CardDescription>
          </div>
        </CardHeader>

        <>
          <div id="scrollPart" className="max-h-[700px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="sticky top-0 bg-white dark:bg-card h-16">
                  <th className="w-[300px] text-left px-6 py-3"></th>
                  {sortedMonths.map((month) => {
                    // Convert YYYY-MM to readable month format like "Aug 25"
                    const [year, monthNum] = month.split("-");
                    const monthDate = new Date(
                      parseInt(year),
                      parseInt(monthNum) - 1
                    );
                    const monthName = monthDate.toLocaleDateString("en-US", {
                      month: "short",
                    });
                    const yearShort = year.slice(-2);

                    return (
                      <th className="pb-2 text-center w-12 px-1" key={month}>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {monthName} {yearShort}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {repoList.map((repo, index) => {
                  return (
                    <tr
                      key={repo}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="w-[280px] text-xs text-gray-700 dark:text-gray-300  font-medium px-4 py-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                          #{index + 1}
                        </span>
                        {getRepoDisplayName(repo)}
                      </td>
                      {shiftedMonths.map((shiftedMonth, monthIndex) => {
                        const originalMonth = sortedMonths[monthIndex];
                        return (
                          <td
                            key={`${repo}-${originalMonth}`}
                            className="px-1 py-2 text-center"
                          >
                            <div className="flex justify-center">
                              <CommitSquare
                                commitsForCombo={
                                  commitSquares?.[repo]?.[shiftedMonth] ?? {
                                    count: 0,
                                    percentage: 0,
                                  }
                                }
                                large={true}
                                tooltip={true}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      </Card>
    </div>
  );
}
