import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Store from "@/models/Store";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // 1. Get the session to identify the user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch the user from DB to get their store ID
    const user = await User.findOne({ email: session.user.email });

    if (!user || !user.store) {
      return NextResponse.json(
        { error: "No store associated with this user" },
        { status: 404 },
      );
    }

    // 3. Fetch the store details using the ID found in the user document
    const store = await Store.findById(user.store);

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("Store fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
