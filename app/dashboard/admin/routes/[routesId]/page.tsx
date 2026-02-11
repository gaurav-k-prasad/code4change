"use client";

import AlertsList from "@/components/admin/AlertsList";
import RouteMap from "@/components/admin/RouteMap";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

// Mock Data for a Single Route
// ! warning
const MOCK_ROUTE_DETAIL = {
  _id: "route_123",
  routeName: "Pharma Supply Chain A",
  status: "ACTIVE",
  origin: { address: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
  destination: { address: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  thresholds: { maxTemp: 8, maxVibration: 5 },
  logistics: { distanceKm: 148, trafficDelayMinutes: 12 },
};

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
  const { routeId } = useParams();

  // In a real app, use useEffect to fetch data based on routeId
  const route = MOCK_ROUTE_DETAIL;

  return (
    <div className="p-8 space-y-6">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {route.routeName}
            <Badge variant={route.status === "ACTIVE" ? "default" : "outline"}>
              {route.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Route ID: <span className="font-mono text-xs">{routeId}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <Card className="p-4 flex flex-col items-center justify-center min-w-30">
            <span className="text-xs text-muted-foreground">Max Temp</span>
            <span className="text-xl font-bold">
              {route.thresholds.maxTemp}°C
            </span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center min-w-30">
            <span className="text-xs text-muted-foreground">Traffic Delay</span>
            <span className="text-xl font-bold text-amber-600">
              +{route.logistics.trafficDelayMinutes}m
            </span>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Map & Logistics */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-125 overflow-hidden relative py-0">
            {/* Google Map Component */}
            <RouteMap
              origin={route.origin.coordinates}
              destination={route.destination.coordinates}
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
