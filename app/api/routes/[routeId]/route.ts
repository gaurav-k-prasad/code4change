import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Route } from "@/models/Route";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { routeId: string } },
) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { routeId } = await params;
    console.log(routeId);

    if (!routeId) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 },
      );
    }

    const route = await Route.findById(routeId);

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return NextResponse.json(route);
  } catch (error: any) {
    console.error("Error fetching route detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
