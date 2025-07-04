import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";
import authMiddleware from "../../lib/authMiddleware.js";
import corsMiddleware from "../../lib/corsMiddleware.js";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const userId = req.user ? req.user.userId : null;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    await dbConnect();
    const urls = await Url.find({ userId }).sort({ createdAt: -1 }).limit(150);
    res.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default corsMiddleware(authMiddleware(handler));
