import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";
import shortid from "shortid";
import validator from "validator";
import authMiddleware from "../../lib/authMiddleware.js";
import corsMiddleware from "../../lib/corsMiddleware.js";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { url, expiresAt } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    let urlToShorten = url;
    if (
      !urlToShorten.startsWith("http://") &&
      !urlToShorten.startsWith("https://")
    ) {
      urlToShorten = "https://" + urlToShorten;
    }
    if (!validator.isURL(urlToShorten, { require_protocol: true })) {
      return res.status(400).json({ error: "Please enter a valid URL" });
    }
    await dbConnect();
    const userId = req.user ? req.user.userId : null;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const shortId = shortid.generate();
    const newUrl = new Url({
      originalUrl: urlToShorten,
      shortUrl: shortId,
      userId: userId,
      clickCount: 0,
      active: true,
      createdAt: new Date(),
      accessLogs: [],
      referers: [],
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    await newUrl.save();
    res.json({
      shortId,
      shortUrl: `${req.headers["x-forwarded-proto"] || "https"}://${
        req.headers.host
      }/r/${shortId}`,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default corsMiddleware(authMiddleware(handler));
