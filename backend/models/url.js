import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 0 }, // Track the number of clicks
  createdAt: { type: Date, default: Date.now }, // Timestamp when the URL was created
  expiresAt: { type: Date }, // Expiration date for the short URL
  lastAccessedAt: { type: Date }, // Timestamp for the last access
  referers: [{ type: String }], // List of referer URLs
  accessLogs: [
    {
      // Log of accesses to the short URL
      date: { type: Date, default: Date.now }, // Timestamp of the access
      referer: String, // Referer URL
      ip: String, // IP address of the requester
      userAgent: String, // User agent string of the requester
    },
  ],
  active: { type: Boolean, default: true }, // Indicates if the URL is active
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
