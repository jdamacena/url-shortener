import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";

export default async function handler(req, res) {
  // TODO: Replace with real user authentication
  const userId = req.user ? req.user.id : null;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    await dbConnect();
    const url = await Url.findOne({ shortUrl: req.query.shortId, userId });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (req.method === "PATCH") {
      if (req.body.originalUrl !== undefined)
        url.originalUrl = req.body.originalUrl;
      if (req.body.expiresAt !== undefined)
        url.expiresAt = req.body.expiresAt
          ? new Date(req.body.expiresAt)
          : undefined;
      if (req.body.active !== undefined) url.active = req.body.active;
      await url.save();
      res.json(url);
    } else if (req.method === "GET") {
      res.json(url);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error updating/fetching URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
