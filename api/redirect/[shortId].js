import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    await dbConnect();
    const { shortId } = req.query;
    const url = await Url.findOne({
      shortUrl: shortId,
      active: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    });
    if (!url) {
      return res.status(404).json({ error: "Short URL not found or expired" });
    }

    // Collect analytics before redirect
    url.clickCount = (url.clickCount || 0) + 1;
    url.lastAccessedAt = new Date();
    url.referers = url.referers || [];
    url.accessLogs = url.accessLogs || [];
    if (req.headers.referer) {
      url.referers.push(req.headers.referer);
    }
    url.accessLogs.push({
      date: new Date(),
      referer: req.headers.referer || "",
      ip: req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "",
      userAgent: req.headers["user-agent"] || "",
    });
    await url.save();

    res.writeHead(302, { Location: url.originalUrl });
    res.end();
  } catch (error) {
    console.error("Redirection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
