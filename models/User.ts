import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for credential users
  image: { type: String },
  targetWpm: { type: Number, default: 60 },
  targetAccuracy: { type: Number, default: 95 },
  testsCompleted: { type: Number, default: 0 },
  averageWpm: { type: Number, default: 0 },
  bestWpm: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
