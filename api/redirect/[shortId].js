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
    res.writeHead(302, { Location: url.originalUrl });
    res.end();
  } catch (error) {
    console.error("Redirection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
