"use client";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// --- Dynamic Imports ---
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface RouteMapProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

export default function RouteMap({ origin, destination }: RouteMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);

  // 1. Initialize Map & Icons (Client-Side Only)
  useEffect(() => {
    setIsMounted(true);

    // Dynamically import Leaflet to fix the icon issue
    // This prevents "window is undefined" errors
    (async () => {
      const L = (await import("leaflet")).default;

      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setCustomIcon(icon);
    })();
  }, []);

  // 2. Fetch OSRM Data
  useEffect(() => {
    if (!origin || !destination) return;

    const fetchRoute = async () => {
      try {
        const start = `${origin.lng},${origin.lat}`;
        const end = `${destination.lng},${destination.lat}`;
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`,
        );
        const data = await response.json();

        if (data.routes?.[0]) {
          // Flip [lng, lat] to [lat, lng]
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]],
          );
          setRouteCoords(coordinates);
        }
      } catch (err) {
        console.error("OSRM Fetch Error:", err);
      }
    };

    fetchRoute();
  }, [origin, destination]);

  // Center calculation
  const centerLat = (origin.lat + destination.lat) / 2;
  const centerLng = (origin.lng + destination.lng) / 2;

  // 3. Strict Hydration Guard
  if (!isMounted || !customIcon) {
    return (
      <div className="h-125 w-full bg-muted flex items-center justify-center rounded-md border">
        <span className="animate-pulse">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className="h-125 w-full rounded-md overflow-hidden border relative z-0">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[origin.lat, origin.lng]} icon={customIcon}>
          <Popup>Origin</Popup>
        </Marker>

        <Marker position={[destination.lat, destination.lng]} icon={customIcon}>
          <Popup>Destination</Popup>
        </Marker>

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.7 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
