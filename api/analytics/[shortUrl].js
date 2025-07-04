import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  // TODO: Replace with real user authentication
  const userId = req.user ? req.user.id : null;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    await dbConnect();
    const url = await Url.findOne({ shortUrl: req.query.shortUrl, userId });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.json(url);
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
