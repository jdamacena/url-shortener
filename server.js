require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/user");
const Url = require("./models/url");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const validator = require("validator");

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy for authentication
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

// Routes
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.post("/shorten", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ error: "You must be logged in to shorten URLs" });
  }

  const originalUrl = req.body.url;

  // Validate the URL before saving
  if (!validator.isURL(originalUrl, { require_protocol: true })) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const shortUrl = shortid.generate();
  let expiresAt = req.body.expiresAt;
  if (expiresAt) {
    // Convert to Date object if provided
    expiresAt = new Date(expiresAt);
    if (isNaN(expiresAt.getTime())) expiresAt = undefined;
  } else {
    expiresAt = undefined;
  }

  const newUrl = new Url({
    originalUrl,
    shortUrl,
    userId: req.user.id, // Save the user ID
    expiresAt,
  });

  await newUrl.save();
  // Respond with JSON instead of HTML
  res.json({
    shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl}`,
    originalUrl,
    code: shortUrl,
  });
});

// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    // Render the registration page again with an error message
    return res.status(400).render("register", { user: req.user, error: "Username already exists" });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.redirect("/login");
});

// User Login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard", // Redirect to dashboard on successful login
    failureRedirect: "/login", // Redirect back to login route on failure
  })
);

// User Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Redirect to home after logout
  });
});

// User Dashboard
app.get("/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }

  // Fetch the user's shortened URLs
  const urls = await Url.find({ userId: req.user.id }); // Assuming you have a userId field in your Url schema
  res.render("dashboard", { urls, user: req.user }); // Render the dashboard with the user's URLs
});

// API endpoint to provide user info
app.get("/api/user-info", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({ username: req.user.username });
  } else {
    res.json({});
  }
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("login", { user: req.user });
});

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("register", { user: req.user });
});

app.get("/url-not-found", (req, res) => {
  res.render("url-not-found", { user: req.user });
});

app.get("/url/:shortUrl", async (req, res) => {
  const url = await Url.findOne({
    shortUrl: req.params.shortUrl,
    userId: req.user && req.user.id,
  });
  if (!url) {
    return res.status(404).render("url-not-found", { user: req.user });
  }
  res.render("url-analytics", { url, user: req.user });
});

// Toggle active state for a URL (activate/deactivate)
app.post("/url/:id/toggle-active", async (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ error: "Unauthorized" });
  const url = await Url.findOne({ _id: req.params.id, userId: req.user.id });
  if (!url) return res.status(404).json({ error: "URL not found" });
  url.active = url.active === false ? true : false;
  await url.save();
  res.json({ success: true, active: url.active });
});

// Allow editing the original URL for a short URL
app.post("/url/:shortUrl/edit-original", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { shortUrl } = req.params;
  const { originalUrl } = req.body;
  if (!validator.isURL(originalUrl, { require_protocol: true })) {
    return res.status(400).json({ error: "Invalid URL format" });
  }
  const url = await Url.findOne({ shortUrl, userId: req.user.id });
  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }
  url.originalUrl = originalUrl;
  await url.save();
  res.json({ success: true });
});

app.get("/:shortUrl", async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (url) {
    // Block if deactivated
    if (url.active === false) {
      return res.status(404).render("url-not-found", { user: req.user });
    }
    // Check for expiration
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(404).render("url-not-found", { user: req.user });
    }
    url.clickCount += 1;
    url.lastAccessedAt = new Date();
    // Capture both HTTP referer and custom ?refer= param
    const httpReferer = req.get("referer");
    const customRefer = req.query.refer;
    url.referers = url.referers || [];
    if (httpReferer) url.referers.push(httpReferer);
    if (customRefer) url.referers.push(`custom:${customRefer}`);
    url.accessLogs = url.accessLogs || [];
    url.accessLogs.push({
      referer: customRefer ? `custom:${customRefer}` : httpReferer,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    await url.save();
    return res.redirect(url.originalUrl);
  }
  res.status(404).render("url-not-found", { user: req.user });
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).render("404", { user: req.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
