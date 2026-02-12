import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Alert } from "@/models/Alert";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // 1. Verify Authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get User's Store ID
    // We fetch the user document to find which store they manage
    const user = await User.findOne({ email: session.user.email });

    if (!user || !user.store) {
      return NextResponse.json(
        {
          error: "No store (and thus no alerts) associated with this account.",
        },
        { status: 404 },
      );
    }

    // 3. Fetch Alerts for that Store
    // We sort by 'createdAt' descending so the newest alerts appear first
    const alerts = await Alert.find({ storeId: user.store })
      .sort({ createdAt: -1 })
      .populate("routeId", "routeName"); // Optional: Pull in route names for the UI

    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error("Alerts Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts", details: error.message },
      { status: 500 },
    );
  }
}
