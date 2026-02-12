import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Route } from "@/models/Route";
import User from "@/models/User";
import { NextResponse } from "next/server";

// --- Helper 1: Geocoding (Address -> Lat/Lng) ---
async function getCoordinates(address: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      address,
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "ColdChainApp/1.0 (admin@yourdomain.com)",
      },
    });

    const data = await res.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error(`Geocoding failed for ${address}:`, error);
    return null;
  }
}

// --- Helper 2: OSRM Routing (Lat/Lng -> Path & Logistics) ---
async function getRouteDetails(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
) {
  try {
    const start = `${origin.lng},${origin.lat}`;
    const end = `${destination.lng},${destination.lat}`;

    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];

      return {
        // Swap [lng, lat] to [lat, lng] for Leaflet/Storage
        path: route.geometry.coordinates.map((coord: number[]) => [
          coord[1],
          coord[0],
        ]),
        distanceKm: parseFloat((route.distance / 1000).toFixed(2)),
        durationMin: Math.round(route.duration / 60),
      };
    }
    return null;
  } catch (error) {
    console.error("OSRM Routing failed:", error);
    return null;
  }
}

// --- Main POST Handler ---
export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Parse Input
    const body = await req.json();
    const { routeName, originAddress, destinationAddress } = body;
    console.log(body);

    // Validation
    if (!routeName || !originAddress || !destinationAddress) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: storeId, routeName, originAddress, destinationAddress",
        },
        { status: 400 },
      );
    }

    // 2. Resolve Coordinates (Parallel for speed)
    const [originCoords, destCoords] = await Promise.all([
      getCoordinates(originAddress),
      getCoordinates(destinationAddress),
    ]);

    if (!originCoords) {
      return NextResponse.json(
        { error: `Could not resolve address: ${originAddress}` },
        { status: 400 },
      );
    }
    if (!destCoords) {
      return NextResponse.json(
        { error: `Could not resolve address: ${destinationAddress}` },
        { status: 400 },
      );
    }

    // 3. Calculate Route Logistics
    const routeData = await getRouteDetails(originCoords, destCoords);

    if (!routeData) {
      return NextResponse.json(
        {
          error: "Could not calculate a driving route between these locations.",
        },
        { status: 422 }, // Unprocessable Entity
      );
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email });
    const storeId = user.store;

    // 4. Construct & Save Document
    const newRoute = await Route.create({
      storeId,
      routeName,
      status: "ACTIVE",
      origin: {
        address: originAddress,
        coordinates: originCoords,
      },
      destination: {
        address: destinationAddress,
        coordinates: destCoords,
      },
      logistics: {
        distanceKm: routeData.distanceKm,
        estimatedDurationMinutes: routeData.durationMin,
        trafficDelayMinutes: 0,
      },
      routeData: {
        path: routeData.path, // The huge array of coordinates
      },
    });

    return NextResponse.json(
      { message: "Route created successfully", route: newRoute },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
