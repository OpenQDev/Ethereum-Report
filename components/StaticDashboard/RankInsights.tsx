import DashboardCard from "./DashboardCard";
import Data from "../../public/data.json";

const RankInsights = () => {
  const listEvaluationStats = Data;
  const insights = Data.insights;
  const monthlyActiveDevs = Data.monthlyActiveDevs;
  const { oneTimeDevsLogins, fullTimeDevsLogins, partTimeDevsLogins } =
    monthlyActiveDevs ?? {};
  const { oneTimeDevs, fullTimeDevs, partTimeDevs } = insights ?? {
    oneTimeDevs: 0,
    fullTimeDevs: 0,
    partTimeDevs: 0,
  };
  const allActiveDevs = oneTimeDevs + fullTimeDevs + partTimeDevs;
  const totalReposProcessed =
    parseInt(listEvaluationStats.totalReposProcessed.$numberLong) ?? 0;

  const totalCommitsAnalyzed =
    parseInt(listEvaluationStats.totalCommits.$numberLong) ?? 0;
  const totalUsersAnalyzed =
    parseInt(listEvaluationStats.totalUsersProcessed.$numberLong) ?? 0;
  const oneTimePercent = Math.round(
    allActiveDevs ? (oneTimeDevs / allActiveDevs) * 100 : 0
  );
  const fullTimePercent = Math.round(
    allActiveDevs ? (fullTimeDevs / allActiveDevs) * 100 : 0
  );
  const partTimePercent = Math.round(
    allActiveDevs ? (partTimeDevs / allActiveDevs) * 100 : 0
  );

  return (
    <div className="py-6">
      {/* Main metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <DashboardCard
          leadText="Tracked in the entire dataset"
          metricName="Current Active Devs"
          leads={allActiveDevs.toString()}
          iconType="Users"
        />

        <DashboardCard
          leadText="Tracked in the entire dataset"
          metricName="Total Users"
          leads={totalUsersAnalyzed.toString()}
          iconType="Users"
        />

        <DashboardCard
          leadText="Tracked in the entire dataset"
          metricName="Total Repos"
          leads={totalReposProcessed.toString()}
          iconType="Repository"
        />
        <DashboardCard
          leadText="Tracked in the entire dataset"
          metricName="Total Commits"
          leads={totalCommitsAnalyzed.toString()}
          iconType="Commit"
        />
      </div>

      {/* Developer types grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <DashboardCard
          leadText="Full-time"
          percentage={fullTimePercent + "% of active devs"}
          metricName="Full-time Developers"
          leads={fullTimeDevs?.toString()}
          iconType="LightningBolt"
          tooltipText="Developers who committed on at least 10 different days in the past 6 weeks"
          rank="full-time"
          devLogins={fullTimeDevsLogins}
        />

        <DashboardCard
          leadText="Part-time"
          percentage={partTimePercent + "% of active devs"}
          metricName="Part-time Developers"
          leads={partTimeDevs?.toString()}
          iconType="Half2"
          tooltipText="Developers who committed on more than one day in the past 6 weeks"
          rank="part-time"
          devLogins={partTimeDevsLogins}
        />

        <DashboardCard
          leadText="One-time"
          percentage={oneTimePercent + "% of active devs"}
          metricName="One-time Developers"
          leads={oneTimeDevs?.toString()}
          iconType="ShadowInner"
          tooltipText="Developers who committed on a single day in the past 6 weeks"
          rank="one-time"
          devLogins={oneTimeDevsLogins}
        />
      </div>
    </div>
  );
};
export default RankInsights;
