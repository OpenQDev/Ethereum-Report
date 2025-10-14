import React from "react";
import RepositoryTable from "./RepositoryTable";

interface ScaffoldRepository {
  repo_url: string;
  full_name: string;
  owner_login: string;
  description: string | null;
  language: string;
  stars_count: number;
  forks_count: number;
  open_issues_count: number;
  total_commits: number;
  months_with_activity: number;
  avg_commits_per_month: number;
  most_active_month: string;
  most_active_month_commits: number;
  archived: boolean;
  disabled: boolean;
  visibility: string;
}

interface Top50ScaffoldReposTableProps {
  repositories: ScaffoldRepository[];
}

const Top50ScaffoldReposTable: React.FC<Top50ScaffoldReposTableProps> = ({
  repositories,
}) => {
  // Transform Scaffold-ETH data format to match RepositoryTable expected format
  const transformedRepos = repositories.map((repo, index) => ({
    internal_id: index,
    github_rest_id: 0,
    github_graphql_id: "",
    repo_url: {
      String: repo.repo_url,
      Valid: true,
    },
    name: repo.full_name.split("/")[1] || repo.full_name,
    full_name: repo.full_name,
    owner_login: repo.owner_login,
    description: {
      String: repo.description || "",
      Valid: !!repo.description,
    },
    language: {
      String: repo.language,
      Valid: !!repo.language,
    },
    stargazers_count: {
      Int32: repo.stars_count,
      Valid: true,
    },
    forks_count: {
      Int32: repo.forks_count,
      Valid: true,
    },
    size: {
      Int32: 0,
      Valid: false,
    },
    default_branch: {
      String: "",
      Valid: false,
    },
    total_commits: repo.total_commits,
    active_days: 0,
    max_concurrent_authors: 0,
  }));

  return (
    <RepositoryTable
      repositories={transformedRepos}
      title="Top 50 Scaffold-ETH Repositories"
      description="Most active repos in the last 12 months using Scaffold-ETH"
      showCommits={true}
    />
  );
};

export default Top50ScaffoldReposTable;
