import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Repository {
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
  repositories: Repository[];
}

const Top50ScaffoldReposTable: React.FC<Top50ScaffoldReposTableProps> = ({
  repositories,
}) => {
  const top50 = repositories.slice(0, 50);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Top 50 Scaffold-ETH Repositories</CardTitle>
          <CardDescription>
            Most active repos in the last 12 months using Scaffold-ETH
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-6 flex-1 flex flex-col">
        <div className="h-[300px] overflow-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Repository</TableHead>
                <TableHead className="text-right">Stars</TableHead>
                <TableHead className="text-right">Commits</TableHead>
                <TableHead className="text-right">Active Months</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top50.map((repo, index) => (
                <TableRow key={repo.full_name}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <a
                        href={repo.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {repo.full_name}
                      </a>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {repo.stars_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {repo.total_commits.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {repo.months_with_activity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Top50ScaffoldReposTable;
