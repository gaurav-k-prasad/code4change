import mongoose, { Document, Schema } from "mongoose";

export interface IRoute extends Document {
  storeId: mongoose.Types.ObjectId;
  routeName: string;
  status: "ACTIVE" | "COMPLETED" | "DELAYED";
  origin: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  logistics: {
    distanceKm: number;
    estimatedDurationMinutes: number;
    trafficDelayMinutes: number;
  };
  googleRouteData: {
    polyline: string; // Used to render the line on the map
    waypointOrder: number[]; // warning ??
  };
}

const RouteSchema: Schema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    routeName: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DELAYED"],
      default: "ACTIVE",
    },

    origin: {
      address: String,
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    destination: {
      address: String,
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },

    logistics: {
      distanceKm: Number,
      estimatedDurationMinutes: Number,
      trafficDelayMinutes: { type: Number, default: 0 },
    },

    googleRouteData: {
      polyline: { type: String }, // Store the encoded polyline
    },
  },
  { timestamps: true },
);

export const Route =
  mongoose.models.Route || mongoose.model<IRoute>("Route", RouteSchema);
