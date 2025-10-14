import RepositoryBarChart from "./RepositoryBarChart";

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
  total_commits: number;
  active_days: number;
  max_concurrent_authors: number;
}

interface TopRepositoriesChartProps {
  repositories: Repository[];
  title?: string;
  description?: string;
}

export default function TopRepositoriesChart({
  repositories,
  title = "Top Repositories by Commits",
  description = "Showing the most active repositories ranked by total commits",
}: TopRepositoriesChartProps) {
  return (
    <RepositoryBarChart
      repositories={repositories}
      title={title}
      description={description}
      dataKey="commits"
      showCommits={true}
    />
  );
}
