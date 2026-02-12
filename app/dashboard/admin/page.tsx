"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { IRoute } from "@/models/Route";
import { AlertTriangle, ArrowRight, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [isPending, setIsPending] = useState(true);
  const [routes, setRoutes] = useState<IRoute[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsPending(true);
      try {
        const response = await fetch("/api/user/routes");
        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setRoutes(data);
        console.log(data);
      } catch (error) {
        toast.error("Failed to get routes");
        console.error(error);
      } finally {
        setIsPending(false);
      }
    };

    fetchRoutes();
  }, []);

  if (isPending) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-30" />
          <Skeleton className="h-10 w-30" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Truck className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No routes found</h3>
        <p className="text-muted-foreground">
          Start by creating your first supply chain route.
        </p>
      </div>
    );
  }

  return (
    <Dialog>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Fleet Overview</h1>

          <DialogTrigger asChild>
            <Button>
              <Truck className="mr-2 h-4 w-4" /> Create New Route
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create new route</DialogTitle>
              <DialogDescription>
                Select a origin and destination
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  routeName: formData.get("routeName"),
                  originAddress: formData.get("origin.address"),
                  destinationAddress: formData.get("destination.address"),
                };

                try {
                  const response = await fetch("/api/routes", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  if (response.ok) {
                    await response.json();
                    toast.success("Created route");
                  } else {
                    const error = await response.json();
                    toast.success("Failed to create route");
                    console.error("Server Error:", error.error);
                  }
                } catch (err) {
                  console.error("Network Error:", err);
                }
              }}
            >
              <FieldGroup className="gap-3">
                <Field>
                  <Label htmlFor="origin-addr">Route Name</Label>
                  <Input
                    id="origin-addr"
                    name="routeName"
                    placeholder="Route Mumbai To Delhi"
                  />
                </Field>
              </FieldGroup>

              <br />

              <FieldGroup className="gap-3">
                <Field>
                  <Label htmlFor="origin-addr">Origin Address</Label>
                  <Input
                    id="origin-addr"
                    name="origin.address"
                    placeholder="Warehouse A, Mumbai"
                  />
                </Field>
              </FieldGroup>
              <br />

              <FieldGroup className="gap-3">
                <Field>
                  <Label htmlFor="dest-addr">Destination Address</Label>
                  <Input
                    id="dest-addr"
                    name="destination.address"
                    placeholder="Distributor B, Pune"
                  />
                </Field>
              </FieldGroup>

              <br />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button type="submit">Create route</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
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
                  Est.{" "}
                  {Math.floor(route.logistics.estimatedDurationMinutes / 60)}h{" "}
                  {route.logistics.estimatedDurationMinutes % 60}m
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 text-green-500" />
                    <span className="truncate">{route.origin.address}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 text-red-500" />
                    <span className="truncate">
                      {route.destination.address}
                    </span>
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
    </Dialog>
  );
}
