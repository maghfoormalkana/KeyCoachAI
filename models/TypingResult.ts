import mongoose from "mongoose";

const TypingResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errors: { type: Number, required: true },
  backspaces: { type: Number, required: true },
  duration: { type: Number, required: true },
  weakKeys: [{ type: String }],
  weakPatterns: [{ type: String }],
  punctuationAccuracy: { type: Number, required: true },
  difficulty: { type: String, default: "medium" },
}, {
  timestamps: true,
});

export default mongoose.models.TypingResult || mongoose.model("TypingResult", TypingResultSchema);
