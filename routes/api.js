import express from 'express';
import shortid from 'shortid';
import validator from 'validator';
import passport from 'passport';
import Url from '../models/url.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Auth routes
router.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword
    });
    
    await user.save();
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error logging in after registration" });
      }
      return res.json({ user: { username: user.username } });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ error: info.message || "Invalid credentials" });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error logging in" });
      }
      return res.json({ user: { username: user.username } });
    });
  })(req, res, next);
});

router.post("/auth/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/auth/user", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({ user: { username: req.user.username } });
});

// URL routes
router.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Check if URL has protocol, if not add https://
    let urlToShorten = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToShorten = 'https://' + url;
    }
    
    if (!validator.isURL(urlToShorten, { require_protocol: true })) {
      return res.status(400).json({ error: "Please enter a valid URL" });
    }
      // Check if URL already exists for this user
    const existingUrl = req.isAuthenticated() 
      ? await Url.findOne({ 
          originalUrl: urlToShorten,
          userId: req.user.id
        })
      : await Url.findOne({ 
          originalUrl: urlToShorten,
          userId: null
        });

    if (existingUrl) {
      return res.json({ 
        shortId: existingUrl.shortUrl,
        message: "URL already shortened"
      });
    }

    const shortId = shortid.generate();
    const newUrl = new Url({
      originalUrl: urlToShorten,
      shortUrl: shortId,
      userId: req.isAuthenticated() ? req.user.id : null,
      clicks: 0,
      active: true,
      createdAt: new Date(),
      clickHistory: []
    });
    
    await newUrl.save();
    res.json({ 
      shortId,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

router.get("/analytics/:shortUrl", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  try {
    const url = await Url.findOne({
      shortUrl: req.params.shortUrl,
      userId: req.user.id
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
