import mongoose from "mongoose";

const BlockchainLogSchema = new mongoose.Schema({
  shipmentId: Number,
  breachDuration: Number,
  txHash: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BlockchainLog ||
  mongoose.model("BlockchainLog", BlockchainLogSchema);
