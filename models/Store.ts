import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // GeoJSON for Google Maps navigation
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: String,
    // The list of items currently in this store
    inventory: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// This index is crucial for calculating distances/navigation
storeSchema.index({ location: "2dsphere" });

export default mongoose.models?.Store || mongoose.model("Store", storeSchema);
