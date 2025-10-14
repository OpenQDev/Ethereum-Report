import RepositoryTable from "./RepositoryTable";

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

interface Top50StarredRepositoriesTableProps {
  starredRepositories: StarredRepository[];
}

export default function Top50StarredRepositoriesTable({
  starredRepositories,
}: Top50StarredRepositoriesTableProps) {
  return (
    <RepositoryTable
      repositories={starredRepositories}
      title="Top 50 Starred Repositories"
      description="Most starred repositories in the ecosystem"
      showCommits={true}
    />
  );
}
