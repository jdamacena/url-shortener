import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  lastAccessedAt: { type: Date },
  referers: [{ type: String }],
  accessLogs: [
    {
      date: { type: Date, default: Date.now },
      referer: String,
      ip: String,
      userAgent: String,
    },
  ],
  active: { type: Boolean, default: true },
});

const Url = mongoose.models.Url || mongoose.model("Url", urlSchema);

export default Url;
