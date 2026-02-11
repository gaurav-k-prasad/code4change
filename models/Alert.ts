import mongoose, { Document, Schema } from "mongoose";

export interface IAlert extends Document {
  storeId: mongoose.Types.ObjectId;
  routeId: mongoose.Types.ObjectId;
  type: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  snapshot: {
    temperature: number;
    humidity: number;
    vibration: number;
    gasLevel: number;
  };
  thresholdBreached: string;
  status: "PENDING" | "RESOLVED" | "AUTO_PENALIZED";
  createdAt: Date;
}

const AlertSchema: Schema = new Schema(
  {
    // References to other collections
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["CRITICAL", "WARNING", "INFO"],
      default: "WARNING",
    },
    message: { type: String, required: true },
    thresholdBreached: { type: String },

    // Moment-in-time sensor data
    snapshot: {
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      vibration: { type: Number, required: true },
      gasLevel: { type: Number, required: true },
    },

    status: {
      type: String,
      enum: ["PENDING", "RESOLVED", "AUTO_PENALIZED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

AlertSchema.index({ storeId: 1, createdAt: -1 });

export const Alert =
  mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);
