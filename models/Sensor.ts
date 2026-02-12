import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  gas: Number,
  accelX: Number,
  accelY: Number,
  accelZ: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Sensor ||
  mongoose.model("Sensor", SensorSchema);
