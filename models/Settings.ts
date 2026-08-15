import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  omnirouteBaseUrl: { type: String, default: "http://192.168.1.7:20128/v1" },
  omnirouteApiKey: { type: String, default: "" },
  omnirouteModel: { type: String, default: "gpt-4o-mini" },
  isConfigured: { type: Boolean, default: false },
  lastTested: { type: Date },
  testStatus: { type: String, enum: ["untested", "success", "failed"], default: "untested" },
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
