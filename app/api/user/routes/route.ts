import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Route } from "@/models/Route";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    console.log(user);
    if (!user || !user.store) {
      return NextResponse.json(
        { error: "No store found for this user account." },
        { status: 404 },
      );
    }

    const routes = await Route.find({ storeId: user.store }).sort({
      createdAt: -1,
    });

    return NextResponse.json(routes);
  } catch (error: any) {
    console.error("Routes Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch routes", details: error.message },
      { status: 500 },
    );
  }
}
