import DashboardCard from "./DashboardCard";
import Data from "../../public/data.json";

const LightDashboard = () => {
  const { listEvaluationStats } = {
    listEvaluationStats: Data,
  };
  const { oneTimeDevs, partTimeDevs, fullTimeDevs } =
    listEvaluationStats?.insights ?? {
      oneTimeDevs: 0,
      partTimeDevs: 0,
      fullTimeDevs: 0,
    };
  const allDevs = oneTimeDevs + partTimeDevs + fullTimeDevs;
  const noActiveUsers = allDevs === 0;
  const activeUsersTitle = noActiveUsers ? "N/A" : `$${0}`;

  const repoCount = parseInt(listEvaluationStats.repoCount.$numberLong) ?? 0;
  const userCount = parseInt(listEvaluationStats.userCount.$numberLong) ?? 0;

  return (
    <div>
      <div className="flex flex-wrap">
        <DashboardCard
          leadText="Current Active Devs"
          metricName="Current Active Devs"
          leads={allDevs.toString()}
        />
      </div>
    </div>
  );
};
export default LightDashboard;
