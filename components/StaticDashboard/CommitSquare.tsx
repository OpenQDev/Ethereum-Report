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
        return "bg-green-800";
      case 800:
      case 700:
        return "bg-green-700";
      case 600:
      case 500:
        return "bg-green-600";
      case 400:
      case 300:
        return "bg-green-500";
      case 200:
      case 100:
        return "bg-green-400";
      default:
        return "bg-gray-300/50";
    }
  };
  const bgColor = color(gradient);

  return (
    <div className="group flex">
      <div
        className={`${large ? "h-6 w-6" : "h-4 w-4"} ${bgColor} rounded-sm`}
      ></div>
      {tooltip && (
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded text-center z-30 max-w-20">
            {commitsForCombo.count}
          </div>
        </div>
      )}
    </div>
  );
}
