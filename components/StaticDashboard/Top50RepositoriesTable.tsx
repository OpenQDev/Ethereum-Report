import RepositoryTable from "./RepositoryTable";

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

interface DataTablesProps {
  repositories: Repository[];
}

export default function Top50RepositoriesTable({
  repositories,
}: DataTablesProps) {
  return (
    <RepositoryTable
      repositories={repositories}
      title="Top 50 Repositories"
      description="Most active repositories by commits and activity"
      showCommits={true}
    />
  );
}
