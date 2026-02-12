import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sensor from "@/models/Sensor";
import BlockchainLog from "@/models/BlockchainLog";
import { serverContract } from "@/lib/serverContract";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectDB();

    // Save sensor data
    await Sensor.create(body);

    // Call ML API
    const mlResponse = await fetch("https://5f73x7sm-8080.inc1.devtunnels.ms/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const mlResult = await mlResponse.json();

    // If anomaly → trigger blockchain
    if (mlResult.anomaly) {
      const tx = await serverContract.reportCompliance(
        1,
        mlResult.breachDuration
      );

      await tx.wait();

      await BlockchainLog.create({
        shipmentId: 1,
        breachDuration: mlResult.breachDuration,
        txHash: tx.hash,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
