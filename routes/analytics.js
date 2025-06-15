import express from "express";
import Url from "../models/url.js";

const router = express.Router();

// Get Analytics for a Short URL
router.get("/analytics/:shortUrl", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const url = await Url.findOne({
      shortUrl: req.params.shortUrl,
      userId: req.user.id,
    });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json(url);
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
