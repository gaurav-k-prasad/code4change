"use client";

import { registerStore } from "@/actions/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Store as StoreIcon } from "lucide-react";
import { useState } from "react";

export default function RegisterStorePage() {
  const [loadingLoc, setLoadingLoc] = useState(false);

  // State to hold coordinates so we can update inputs programmatically
  const [coords, setCoords] = useState({ lat: "", lng: "" });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        });
        setLoadingLoc(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setLoadingLoc(false);
      },
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-lg shadow-md border-t-4 border-t-orange-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-2xl">Register New Store</CardTitle>
          </div>
          <CardDescription>
            Add a distribution point or warehouse to the network.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={registerStore} className="grid gap-6">
            {/* Store Details */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Central Supply Hub #4"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Market St, Sector 5..."
              />
            </div>

            {/* Location Section */}
            <div className="rounded-md border p-4 bg-orange-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <Label className="font-semibold text-gray-700">
                    Geographic Coordinates
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetLocation}
                  disabled={loadingLoc}
                  className="h-8 text-xs"
                >
                  <Navigation className="mr-2 h-3 w-3" />
                  {loadingLoc ? "Locating..." : "Use My Location"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-xs text-gray-500">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    placeholder="0.0000"
                    value={coords.lat}
                    onChange={(e) =>
                      setCoords({ ...coords, lat: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-xs text-gray-500">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    placeholder="0.0000"
                    value={coords.lng}
                    onChange={(e) =>
                      setCoords({ ...coords, lng: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              type="submit"
            >
              Create Store Entry
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
