import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Rocket, X, Info } from "lucide-react";
import useNotificationHash from "../../hooks/useNotificationHash";
import { cn } from "../lib/utils";

export default function Notification({
  children,
  className = "",
  info = false,
  title = "",
  isLoading = false,
  hash = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  info?: boolean;
  isLoading?: boolean;
  title?: string;
  id: string;
  version?: number;
  hash?: string;
}>) {
  const { isVisible, handleClose } = useNotificationHash(hash);

  if (!isVisible) return null;

  return (
    <div className={cn("relative pb-3", className)}>
      <Alert>
        {!info ? <Rocket className="h-4 w-4" /> : <Info className="h-4 w-4" />}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <div className="pr-8 pb-1">{children}</div>
        </AlertDescription>
        <button
          className="absolute right-2 top-2 rounded-full p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>
    </div>
  );
}
