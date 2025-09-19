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

interface DeveloperByStars {
  login: string;
  total_stars: string;
  email: string;
  twitter_username: string;
}

interface Top50DevelopersByStarsTableProps {
  developers: DeveloperByStars[];
}

export default function Top50DevelopersByStarsTable({
  developers,
}: Top50DevelopersByStarsTableProps) {
  const formatStars = (stars: string) => {
    const num = parseInt(stars);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Top Developers by Stars Table */}
      <Card className="h-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-4 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Top 50 Developers by Stars</CardTitle>
            <CardDescription>
              Leading developers in the Ethereum ecosystem ranked by total stars
              across all their GitHub repositories
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="h-[500px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Twitter
                  </TableHead>
                  <TableHead className="text-right">⭐ Stars</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {developers.slice(0, 50).map((dev, index) => {
                  const starsCount = parseInt(dev.total_stars);
                  return (
                    <TableRow key={`dev-stars-${index}-${dev.login}`}>
                      <TableCell className="font-medium">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Image
                            src={`https://github.com/${dev.login}.png`}
                            alt={dev.login}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full flex-shrink-0"
                            onError={(e) => {
                              // Fallback to a default avatar if user avatar fails
                              const target = e.target as HTMLImageElement;
                              target.src = `https://github.com/identicons/${dev.login}.png`;
                            }}
                          />
                          <div className="min-w-0">
                            <a
                              href={`https://github.com/${dev.login}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline block truncate"
                            >
                              {dev.login}
                            </a>
                            {/* Mobile-only additional info */}
                            <div className="md:hidden mt-1 space-y-1">
                              {dev.email && (
                                <div className="text-xs">
                                  <a
                                    href={`mailto:${dev.email}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
                                  >
                                    📧 {dev.email}
                                  </a>
                                </div>
                              )}
                              {dev.twitter_username && (
                                <div className="text-xs">
                                  <a
                                    href={`https://twitter.com/${dev.twitter_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    🐦 @{dev.twitter_username}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {dev.email ? (
                          <a
                            href={`mailto:${dev.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                          >
                            {dev.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {dev.twitter_username ? (
                          <a
                            href={`https://twitter.com/${dev.twitter_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            @{dev.twitter_username}
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatStars(dev.total_stars)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
