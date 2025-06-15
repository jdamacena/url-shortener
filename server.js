import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import path from "path";
import User from "./models/user.js";
import Url from "./models/url.js";
import apiRouter from "./routes/api.js";
import authRouter from "./routes/auth.js";
import urlRouter from "./routes/url.js";
import analyticsRouter from "./routes/analytics.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Configure Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// API Routes first
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/url", urlRouter);
app.use("/analytics", analyticsRouter);

// URL Shortener redirect route - matches shortUrls only using RegExp for Express 5
app.get(/^\/([A-Za-z0-9_-]+)$/, async (req, res) => {
  try {
    const shortUrl = req.params[0];
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Block if deactivated
    if (url.active === false) {
      return res.redirect("/expired");
    }

    // Check for expiration
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.redirect("/expired");
    }

    // Update analytics
    url.clicks = (url.clicks || 0) + 1;
    url.lastAccessedAt = new Date();
    url.clickHistory = url.clickHistory || [];
    url.clickHistory.push({
      timestamp: new Date(),
      referrer: req.get("referer") || null,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });

    await url.save();
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Serve Vue.js app for all remaining routes
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
