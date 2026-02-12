"use server";

import connectDB from "@/lib/db";
import Store from "@/models/Store"; // Adjust path to your schema
import User from "@/models/User";
import { redirect } from "next/navigation";
import { registerUser } from "./user";

export async function registerStore(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;

  // Parse coordinates
  const lat = parseFloat(formData.get("latitude") as string);
  const lng = parseFloat(formData.get("longitude") as string);

  if (!name) {
    throw new Error("Store Name is required");
  }

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Valid coordinates are required");
  }

  await connectDB();

  try {
    const newStore = await Store.create({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      inventory: [],
    });
    console.log(newStore);
    await registerUser(newStore._id);
  } catch (error) {
    console.error("Store registration failed:", error);
    throw new Error("Failed to register store");
  }

  redirect("/dashboard/admin");
}
