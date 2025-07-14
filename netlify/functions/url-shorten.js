import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";
import shortid from "shortid";
import validator from "validator";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Auth middleware for Netlify Functions
function authenticateUser(event) {
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

export async function handler(event, context) {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Authenticate user
    const user = authenticateUser(event);

    const { url, expiresAt } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "URL is required" }),
      };
    }

    let urlToShorten = url;
    if (
      !urlToShorten.startsWith("http://") &&
      !urlToShorten.startsWith("https://")
    ) {
      urlToShorten = "https://" + urlToShorten;
    }

    if (!validator.isURL(urlToShorten, { require_protocol: true })) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Please enter a valid URL" }),
      };
    }

    await dbConnect();

    const shortId = shortid.generate();
    const newUrl = new Url({
      originalUrl: urlToShorten,
      shortUrl: shortId,
      userId: user.userId,
      clickCount: 0,
      active: true,
      createdAt: new Date(),
      accessLogs: [],
      referers: [],
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    await newUrl.save();

    const host = event.headers.host || "localhost";
    const protocol = event.headers["x-forwarded-proto"] || "https";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        shortId,
        shortUrl: `${protocol}://${host}/r/${shortId}`,
      }),
    };
  } catch (error) {
    console.error("Error creating short URL:", error);

    if (
      error.message === "No token provided" ||
      error.message === "Invalid or expired token"
    ) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
