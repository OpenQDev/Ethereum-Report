import { InfoIcon } from "@primer/octicons-react";
import { useState } from "react";
import RankList from "./RankList";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import {
  PersonIcon,
  Half2Icon,
  LightningBoltIcon,
  ShadowInnerIcon,
  CommitIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { DollarSignIcon, Users, GitCommit, FolderOpen } from "lucide-react";
import { formatNumber } from "../../lib/utils";

type IconType =
  | "Person"
  | "Half2"
  | "LightningBolt"
  | "DollarSign"
  | "ShadowInner"
  | "TwoPerson"
  | "Users"
  | "Repository"
  | "Commit";

const iconComponents = {
  Person: PersonIcon,
  Half2: Half2Icon,
  LightningBolt: LightningBoltIcon,
  ShadowInner: ShadowInnerIcon,
  DollarSign: DollarSignIcon,
  Users: Users,
  Repository: FolderOpen,
  Commit: GitCommit,
  TwoPerson: ({ className }: { className?: string }) => (
    <div className="flex items-end">
      <PersonIcon
        className={className}
        style={{ width: "0.8em", height: "0.8em", marginRight: "1px" }}
      />
      <PersonIcon className={className} />
    </div>
  ),
};

const DashboardCard = ({
  leads,
  percentage,
  metricName,
  leadText,
  tooltipText,
  rank,
  iconType,
  devLogins,
}: {
  leads: string;
  percentage?: string;
  metricName: string;
  leadText: string;
  tooltipText?: string;
  rank?: string;
  iconType?: IconType;
  devLogins?: string[];
}) => {
  const [showModal, setShowModal] = useState(false);

  const show = !!rank && !!parseInt(leads);
  const IconComponent = iconType
    ? iconComponents[iconType as keyof typeof iconComponents] || PersonIcon
    : PersonIcon;

  return (
    <Card className="flex-1 gap-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center">
          <CardTitle className="text-sm font-medium">{metricName}</CardTitle>
          {tooltipText && (
            <div className="group flex ml-2 relative">
              <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="relative bg-gray-900 text-white px-4 py-3 text-sm rounded-lg shadow-lg w-80 whitespace-normal border border-gray-700 leading-relaxed">
                  {tooltipText.split("\n").map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(leads)}</div>
        <p className="text-xs text-muted-foreground">
          {percentage || leadText}
        </p>
        {show && (
          <button
            className="text-link cursor-pointer hover:opacity-75 mt-2 text-sm"
            onClick={() => setShowModal(true)}
          >
            Show Devs
          </button>
        )}
      </CardContent>

      {show && (
        <RankList
          showModal={showModal}
          setShowModal={setShowModal}
          rank={rank}
          devLogins={devLogins ?? []}
        />
      )}
    </Card>
  );
};

export default DashboardCard;
