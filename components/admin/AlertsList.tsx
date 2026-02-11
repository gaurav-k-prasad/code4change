import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

interface Alert {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
  status: string;
  snapshot: { temperature: number };
}

export default function AlertsList({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
        <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
        <p>No compliance issues detected.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-100 pr-4">
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className={`p-4 rounded-lg border flex gap-3 items-start ${
              alert.type === "CRITICAL"
                ? "bg-red-50 border-red-200 dark:bg-red-950/20"
                : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20"
            }`}
          >
            <div className="mt-1">
              {alert.type === "CRITICAL" ? (
                <ShieldAlert className="h-5 w-5 text-red-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4
                  className={`font-semibold text-sm ${
                    alert.type === "CRITICAL"
                      ? "text-red-900 dark:text-red-200"
                      : "text-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {alert.type} ALERT
                </h4>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(alert.createdAt), "HH:mm dd/MM")}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {alert.message}
              </p>

              <div className="mt-2 text-xs flex gap-2 font-mono opacity-80">
                <span className="bg-white/50 px-1 rounded">
                  Temp: {alert.snapshot.temperature}°C
                </span>
                <span className="bg-white/50 px-1 rounded">
                  Status: {alert.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
