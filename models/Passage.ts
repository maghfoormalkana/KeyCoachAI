import mongoose from "mongoose";

const PassageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["general", "books", "poems", "quotes", "code", "science", "history", "technology", "movies", "sports"]
  },
  difficulty: { 
    type: String, 
    default: "medium",
    enum: ["easy", "medium", "hard"]
  },
  wordCount: { type: Number, default: 0 },
  // Estimated duration in seconds based on average 40 WPM typing speed
  estimatedDuration: { 
    type: String, 
    default: "medium",
    enum: ["short", "medium", "long", "extra-long"]
  },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

// Auto-calculate word count and estimated duration before saving
PassageSchema.pre("save", function(next) {
  this.wordCount = this.content.split(/\s+/).filter(w => w.length > 0).length;

  // Estimate duration category based on word count
  // At 40 WPM average: ~0.67 words/sec
  // short: <30s (<20 words)
  // medium: 30-90s (20-60 words)  
  // long: 90-300s (60-200 words)
  // extra-long: >300s (>200 words)
  if (this.wordCount < 20) {
    this.estimatedDuration = "short";
  } else if (this.wordCount < 60) {
    this.estimatedDuration = "medium";
  } else if (this.wordCount < 200) {
    this.estimatedDuration = "long";
  } else {
    this.estimatedDuration = "extra-long";
  }

  next();
});

export default mongoose.models.Passage || mongoose.model("Passage", PassageSchema);
