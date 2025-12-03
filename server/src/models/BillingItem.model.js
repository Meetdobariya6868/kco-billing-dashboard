// server/src/models/BillingItem.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BillingItemSchema = new Schema(
  {
    provider: { type: String, required: true, enum: ["AWS", "GCP", "AZURE", "OTHER"], index: true },
    accountId: { type: String, index: true },
    service: { type: String, required: true, index: true },
    region: { type: String },
    usageStart: { type: Date },
    usageEnd: { type: Date },
    usageDate: { type: Date, required: true, index: true }, // canonical date for aggregation
    cost: { type: Number, required: true, index: true },
    currency: { type: String, default: "USD" },
    description: { type: String },
    raw: { type: Schema.Types.Mixed }, // store raw row if needed
  },
  { timestamps: true }
);

// Compound index example for common queries (provider + date)
BillingItemSchema.index({ provider: 1, usageDate: -1 });

export default model("BillingItem", BillingItemSchema);
