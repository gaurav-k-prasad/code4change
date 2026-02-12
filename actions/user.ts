"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User"; // Adjust path to your schema

export async function registerUser(storeId: string) {
  const user = (await auth())?.user;

  await connectDB();

  try {
    return await User.create({
      name: user?.name as string,
      email: user?.email as string,
      store: storeId,
    });
  } catch (error) {
    console.error("Store registration failed:", error);
    throw new Error("Failed to register store");
  }
}
