"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Top 50 Starred Repositories</CardTitle>
          <CardDescription>
            Most starred repositories in the ecosystem
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-6 flex-1 flex flex-col">
        <div className="h-[420px] overflow-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Repository</TableHead>
                <TableHead className="hidden md:table-cell">Owner</TableHead>
                <TableHead className="hidden lg:table-cell">Language</TableHead>
                <TableHead className="text-right">Stars</TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  Forks
                </TableHead>
                <TableHead className="text-right hidden md:table-cell">
                  Commits
                </TableHead>
                <TableHead className="text-right hidden lg:table-cell">
                  Size (KB)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {starredRepositories.slice(0, 50).map((repo, index) => (
                <TableRow key={`starred-${index}-${repo.internal_id}`}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <a
                        href={
                          repo.repo_url.Valid
                            ? repo.repo_url.String
                            : `https://github.com/${repo.full_name}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline block truncate"
                      >
                        {repo.name}
                      </a>
                      {repo.description.Valid && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {repo.description.String}
                        </div>
                      )}
                      <div className="md:hidden flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                        <span>{repo.owner_login}</span>
                        {repo.language.Valid && (
                          <Badge variant="secondary" className="text-xs">
                            {repo.language.String}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <a
                      href={`https://github.com/${repo.owner_login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {repo.owner_login}
                    </a>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {repo.language.Valid ? (
                      <Badge variant="secondary">{repo.language.String}</Badge>
                    ) : (
                      <Badge variant="outline">Unknown</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {repo.stargazers_count.Valid
                      ? repo.stargazers_count.Int32.toLocaleString()
                      : "0"}
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    {repo.forks_count.Valid
                      ? repo.forks_count.Int32.toLocaleString()
                      : "0"}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {repo.total_commits.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right hidden lg:table-cell">
                    {repo.size.Valid ? repo.size.Int32.toLocaleString() : "0"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
