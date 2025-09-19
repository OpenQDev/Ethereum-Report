"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";
import CommitSquaresChart from "./CommitSquareChart";
import { DependenciesBarChart } from "./DependenciesBarChart";
import LightDashboard from "./LightDashboard";
import RankInsights from "./RankInsights";
import TeamsActivityChart from "./TeamsActivityChart";
import TeamsAndUsersActivityChart from "./TeamsAndUsersActivityChart";
import TopDevelopersChart from "./TopDevelopersChart";
import TopRepositoriesChart from "./TopRepositoriesChart";
import TopStarredReposChart from "./TopStarredReposChart";

import Data from "../../public/data.json";
import Top50DevelopersTable from "./Top50DevelopersTable";
import Top50RepositoriesTable from "./Top50RepositoriesTable";
import Top50StarredRepositoriesTable from "./Top50StarredRepositoriesTable";
import LanguageDistributionChart from "./LanguageDistributionChart";

const UsersMap = dynamic(() => import("./UsersMap"), {
  ssr: false,
});

const getMonths = (avgListEvaluationEndTime?: null | number) => {
  const mostRecentMonth = avgListEvaluationEndTime
    ? new Date(avgListEvaluationEndTime).toISOString().slice(0, 7)
    : new Date().toISOString().slice(0, 7);
  const getLast12Months = (mostRecentMonth: string) => {
    const lastMonth = new Date(mostRecentMonth);
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(
        new Date(lastMonth.getFullYear(), lastMonth.getMonth() - i, 1)
          .toISOString()
          .slice(0, 7)
      );
    }
    return months.reverse();
  };
  const months = getLast12Months(mostRecentMonth);
  return months;
};

export default function Dashboard() {
  const avgListEvaluationEndTime = useMemo(() => Date.now(), []);
  const months = getMonths(avgListEvaluationEndTime);

  const usersLocations = Data.usersLocations;
  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-4 md:px-6">
      <RankInsights />
      <TeamsAndUsersActivityChart
        title={`Monthly Active Developers`}
        months={months}
      />
      <TeamsActivityChart title={`Monthly Active Teams`} months={months} />
      <CommitSquaresChart
        commitSquares={
          Data.commitSquares as Record<
            string,
            Record<string, { count: number; percentage: number }>
          >
        }
        months={months}
      />
      <DependenciesBarChart
        dependencies={Data.topDependencies.map((elem) => {
          return {
            dependency_name: elem.dependency_name,
            count: parseInt(elem.count.toString()),
          };
        })}
        title="Top Dependencies"
        description="Showing the top dependencies found in this list by repositories using them"
        top={50}
      />
      <DependenciesBarChart
        dependencies={Data.topBlockchains.map((elem) => {
          return {
            dependency_name: elem.dependency_name,
            count: parseInt(elem.count.toString()),
          };
        })}
        title="Top Blockchains"
        description="Showing the top blockchains found in this list by repositories using them"
        top={50}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
        <div className="flex flex-col h-full">
          <UsersMap usersLocations={usersLocations} />
        </div>
        <div className="flex flex-col h-full">
          <LanguageDistributionChart
            repositories={Data.topStarredRepos}
            title="Language Distribution"
            description="Distribution of programming languages in top starred repositories"
          />
        </div>
      </div>
      {/* Top Developers - Chart and Table side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
        <div className="flex flex-col">
          <TopDevelopersChart
            developers={Data.top100Devs.filter((dev) => dev.login !== "")}
            title="Top Developers by Activity"
            description="Most active developers ranked by total commits and unique repositories"
          />
        </div>

        <div className="flex flex-col">
          <Top50DevelopersTable
            developers={Data.top100Devs.filter((dev) => dev.login !== "")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
        <div className="h-full">
          <TopRepositoriesChart
            repositories={Data.top100Repos.filter((repo) => repo.name !== "")}
            title="Top Repositories by Activity"
            description="Most active repositories ranked by total commits"
          />
        </div>
        <div className="h-full">
          <Top50RepositoriesTable
            repositories={Data.top100Repos.filter((repo) => repo.name !== "")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
        <div className="h-full">
          <TopStarredReposChart
            repositories={Data.topStarredRepos}
            title="Top Starred Repositories"
            description="Most starred repositories with language distribution analysis"
          />
        </div>
        <div className="h-full">
          <Top50StarredRepositoriesTable
            starredRepositories={Data.topStarredRepos}
          />
        </div>
        {/* <DataTables
        developers={Data.top100Devs.filter((dev) => dev.login !== "")}
        repositories={Data.top100Repos.filter((repo) => repo.name !== "")}
        starredRepositories={Data.topStarredRepos.filter(
          (repo) => repo.name !== ""
        )}
      /> */}
      </div>
    </div>
  );
}
