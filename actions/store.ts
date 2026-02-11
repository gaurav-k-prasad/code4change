"use server";

import connectDB from "@/lib/db";
import Store from "@/models/Store"; // Adjust path to your schema
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
    await registerUser();
    await Store.create({
      name,
      address,
      location: {
        type: "Point", // Must be 'Point' per your schema enum
        coordinates: [lng, lat], // ⚠️ CRITICAL: MongoDB uses [Longitude, Latitude]
      },
      inventory: [], // Start with empty inventory
    });
  } catch (error) {
    console.error("Store registration failed:", error);
    throw new Error("Failed to register store");
  }

  redirect("/dashboard/store");
}
