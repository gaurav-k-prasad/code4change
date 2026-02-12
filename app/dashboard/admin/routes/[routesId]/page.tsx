"use client";

import AlertsList from "@/components/admin/AlertsList";
import RouteMap from "@/components/admin/RouteMap";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RouteDetailSkeleton from "@/components/ui/route-details-skeleton";
import { IRoute } from "@/models/Route";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Mock Alerts linked to this route
// ! warning
const MOCK_ALERTS = [
  {
    _id: "alert_1",
    type: "CRITICAL",
    message: "Temperature breach detected (10.5°C)",
    createdAt: new Date().toISOString(),
    status: "AUTO_PENALIZED",
    snapshot: { temperature: 10.5, humidity: 60 },
  },
  {
    _id: "alert_2",
    type: "WARNING",
    message: "High vibration detected during transit",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: "RESOLVED",
    snapshot: { temperature: 7.2, humidity: 55 },
  },
];

export default function RouteDetailPage() {
  const { routesId: routeId } = useParams();

  const [route, setRoute] = useState<IRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch if we have a routeId
    if (!routeId) return;

    const fetchRouteDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/routes/${routeId}`);

        if (!response.ok) {
          throw new Error("Route not found");
        }

        const data = await response.json();
        setRoute(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not load route details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteDetail();
  }, [routeId]);

  const getZoomLevel = (distance: number): number => {
    if (distance < 5) return 13; // City block
    if (distance < 20) return 12; // City-wide
    if (distance < 50) return 11; // Metro area
    if (distance < 150) return 10; // Regional / Interstate
    if (distance < 500) return 9; // State-wide
    return 6; // Country-wide
  };

  if (isLoading) {
    return <RouteDetailSkeleton />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {route?.routeName}
            <Badge variant={route?.status === "ACTIVE" ? "default" : "outline"}>
              {route?.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Route ID: <span className="font-mono text-xs">{routeId}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Map & Logistics */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-200 overflow-hidden relative py-0">
            <RouteMap
              origin={route.origin.coordinates}
              destination={route.destination.coordinates}
              zoom={getZoomLevel(route?.logistics.distanceKm)}
            />
          </Card>
        </div>

        {/* Right Column: Alerts & Compliance */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Compliance Log</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertsList alerts={MOCK_ALERTS} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
