import express from "express";
import shortid from "shortid";
import validator from "validator";
import Url from "../models/url.js";

const router = express.Router();

// Shorten URL
router.post("/shorten", async (req, res) => {
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
    const shortId = shortid.generate();
    const newUrl = new Url({
      originalUrl: urlToShorten,
      shortUrl: shortId,
      userId: req.isAuthenticated() ? req.user.id : null,
      clicks: 0,
      active: true,
      createdAt: new Date(),
      clickHistory: [],
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    await newUrl.save();
    res.json({
      shortId,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortId}`,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get User URLs
router.get("/urls", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const urls = await Url.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
