import RepositoryBarChart from "./RepositoryBarChart";

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

interface TopStarredReposChartProps {
  repositories: StarredRepository[];
  title?: string;
  description?: string;
}

export default function TopStarredReposChart({
  repositories,
  title = "Top Starred Repositories",
  description = "Showing the most starred repositories and their language distribution",
}: TopStarredReposChartProps) {
  return (
    <RepositoryBarChart
      repositories={repositories}
      title={title}
      description={description}
      dataKey="stars"
      showCommits={false}
    />
  );
}
