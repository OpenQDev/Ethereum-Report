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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  active_days?: number;
  max_concurrent_authors?: number;
}

interface RepositoryTableProps {
  repositories: Repository[];
  title: string;
  description: string;
  showCommits?: boolean;
}

export default function RepositoryTable({
  repositories,
  title,
  description,
  showCommits = true,
}: RepositoryTableProps) {
  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="h-[500px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead className="max-w-[500px]">Repository</TableHead>
                  <TableHead className="hidden md:table-cell">Owner</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Language
                  </TableHead>
                  <TableHead className="text-right">Stars</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    Forks
                  </TableHead>
                  {showCommits && (
                    <TableHead className="text-right hidden md:table-cell">
                      Commits
                    </TableHead>
                  )}
                  <TableHead className="text-right hidden lg:table-cell">
                    Size (KB)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repositories.slice(0, 50).map((repo, index) => (
                  <TableRow key={`repo-${index}-${repo.internal_id}`}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell className="max-w-[500px]">
                      <div className="space-y-1 min-w-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
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
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="start"
                            avoidCollisions={true}
                            collisionPadding={8}
                          >
                            <p>{repo.name}</p>
                          </TooltipContent>
                        </Tooltip>
                        {repo.description.Valid && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-muted-foreground truncate">
                                {repo.description.String}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="start"
                              avoidCollisions={true}
                              collisionPadding={8}
                            >
                              <p className="max-w-[300px] break-words">
                                {repo.description.String}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <div className="md:hidden flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                          <span className="truncate">{repo.owner_login}</span>
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
                        className=" text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {repo.owner_login}
                      </a>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {repo.language.Valid ? (
                        <Badge variant="secondary">
                          {repo.language.String}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Unknown</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right ">
                      {repo.stargazers_count.Valid
                        ? repo.stargazers_count.Int32.toLocaleString()
                        : "0"}
                    </TableCell>
                    <TableCell className="text-right  hidden sm:table-cell">
                      {repo.forks_count.Valid
                        ? repo.forks_count.Int32.toLocaleString()
                        : "0"}
                    </TableCell>
                    {showCommits && (
                      <TableCell className="text-right  hidden md:table-cell">
                        {repo.total_commits.toLocaleString()}
                      </TableCell>
                    )}
                    <TableCell className="text-right  hidden lg:table-cell">
                      {repo.size.Valid ? repo.size.Int32.toLocaleString() : "0"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
