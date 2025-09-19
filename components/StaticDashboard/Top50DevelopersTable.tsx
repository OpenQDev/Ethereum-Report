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
import Image from "next/image";

interface Developer {
  internal_id: number;
  login: string;
  name: {
    String: string;
    Valid: boolean;
  };
  avatar_url: {
    String: string;
    Valid: boolean;
  };
  location: {
    String: string;
    Valid: boolean;
  };
  company: {
    String: string;
    Valid: boolean;
  };
  total_commits: number;
  unique_repos: number;
}

interface Top50DevelopersTableProps {
  developers: Developer[];
}

export default function Top50DevelopersTable({
  developers,
}: Top50DevelopersTableProps) {
  return (
    <div className="space-y-8">
      {/* Top Developers Table */}
      <Card className="h-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Top 50 Developers</CardTitle>
            <CardDescription>
              Most active developers by total commits and unique repositories
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="h-[400px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead className="hidden md:table-cell">Name</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Company
                  </TableHead>
                  <TableHead className="text-right">Commits</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    Repos
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {developers.slice(0, 50).map((dev, index) => (
                  <TableRow key={`dev-${index}-${dev.internal_id}`}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {dev.avatar_url.Valid && (
                          <Image
                            src={dev.avatar_url.String}
                            alt={dev.login}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <a
                            href={`https://github.com/${dev.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline block truncate"
                          >
                            {dev.login}
                          </a>
                          <div className="md:hidden text-xs text-muted-foreground truncate">
                            {dev.name.Valid ? dev.name.String : ""}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {dev.name.Valid ? dev.name.String : "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {dev.location.Valid ? dev.location.String : "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {dev.company.Valid ? dev.company.String : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {dev.total_commits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      {dev.unique_repos}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
