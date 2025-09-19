export default function CommitSquare({
  commitsForCombo,
  large,
  tooltip,
}: Readonly<{
  commitsForCombo: {
    count: number;
    percentage: number;
  };
  large?: boolean;
  tooltip?: boolean;
}>) {
  const percentage = commitsForCombo.percentage;
  const gradient = (Math.ceil(percentage * 10) / 10) * 1000;

  const color = (gradient: number) => {
    switch (gradient) {
      case 1000:
      case 900:
        return "bg-blue-900 dark:bg-blue-800";
      case 800:
      case 700:
        return "bg-blue-800 dark:bg-blue-700";
      case 600:
      case 500:
        return "bg-blue-700 dark:bg-blue-600";
      case 400:
      case 300:
        return "bg-blue-600 dark:bg-blue-500";
      case 200:
      case 100:
        return "bg-blue-500 dark:bg-blue-400";
      default:
        return "bg-blue-100 dark:bg-blue-950/50";
    }
  };
  const bgColor = color(gradient);

  return (
    <div className="group flex">
      <div
        className={`${large ? "h-3.5 w-3.5" : "h-3 w-3"} ${bgColor} rounded-[2px]`}
      ></div>
      {tooltip && (
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-card border text-card-foreground text-xs px-1.5 py-0.5 rounded text-center z-30 max-w-20 shadow-lg">
            {commitsForCombo.count}
          </div>
        </div>
      )}
    </div>
  );
}
