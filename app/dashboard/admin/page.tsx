"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowRight, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock Data - Replace with your API call to /api/routes
// ! warning
const MOCK_ROUTES = [
  {
    _id: "route_123",
    routeName: "Pharma Supply Chain A",
    status: "ACTIVE",
    origin: { address: "Mumbai Central Warehouse" },
    destination: { address: "Pune Distribution Hub" },
    logistics: { distanceKm: 148, estimatedDurationMinutes: 180 },
    alertCount: 2,
  },
  {
    _id: "route_456",
    routeName: "Dairy Logistics North",
    status: "COMPLETED",
    origin: { address: "Gujarat Milk Coop" },
    destination: { address: "Delhi Processing Unit" },
    logistics: { distanceKm: 850, estimatedDurationMinutes: 920 },
    alertCount: 0,
  },
];

export default function AdminDashboard() {
  const [routes] = useState(MOCK_ROUTES);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fleet Overview</h1>
        <Button>
          <Truck className="mr-2 h-4 w-4" /> Create New Route
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <Card key={route._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {route.routeName}
              </CardTitle>
              <Badge
                variant={route.status === "ACTIVE" ? "default" : "secondary"}
              >
                {route.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {route.logistics.distanceKm} km
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Est. {Math.floor(route.logistics.estimatedDurationMinutes / 60)}
                h {route.logistics.estimatedDurationMinutes % 60}m
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 text-green-500" />
                  <span className="truncate">{route.origin.address}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 text-red-500" />
                  <span className="truncate">{route.destination.address}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {route.alertCount > 0 ? (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" /> {route.alertCount}{" "}
                    Alerts
                  </Badge>
                ) : (
                  <div />
                )}

                <Link href={`/dashboard/admin/routes/${route._id}`}>
                  <Button variant="ghost" size="sm">
                    Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
