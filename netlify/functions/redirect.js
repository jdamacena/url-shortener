import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";
import { getPathSegments } from "./utils/path.js";

export async function handler(event, context) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    await dbConnect();
    
    const pathSegments = getPathSegments(event);
    const shortId = pathSegments[pathSegments.length - 1] || "";

    if (!shortId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing shortId in path" }),
      };
    }

    // ensure SITE_URL is set for redirects to error pages
    const SITE_URL = process.env.VITE_SITE_URL;
    if (!SITE_URL) {
      console.error("Missing VITE_SITE_URL env var");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server config error" }),
      };
    }
    // look up raw document to distinguish not-found vs expired/inactive
    const urlDoc = await Url.findOne({ shortUrl: shortId });
    if (!urlDoc) {
      // redirect to link-not-found page
      return {
        statusCode: 302,
        headers: { Location: `${SITE_URL}/link-not-found` },
      };
    }
    // expired or deactivated
    const now = new Date();
    if (!urlDoc.active || (urlDoc.expiresAt && urlDoc.expiresAt <= now)) {
      return { statusCode: 302, headers: { Location: `${SITE_URL}/expired` } };
    }
    const url = urlDoc;

    // Collect analytics before redirect
    url.clickCount = (url.clickCount || 0) + 1;
    url.lastAccessedAt = new Date();
    url.referers = url.referers || [];
    url.accessLogs = url.accessLogs || [];

    if (event.headers.referer) {
      url.referers.push(event.headers.referer);
    }

    url.accessLogs.push({
      date: new Date(),
      referer: event.headers.referer || "",
      ip: event.headers["x-forwarded-for"] || event.headers["client-ip"] || "",
      userAgent: event.headers["user-agent"] || "",
    });

    await url.save();

    return {
      statusCode: 302,
      headers: {
        Location: url.originalUrl,
      },
    };
  } catch (error) {
    console.error("Redirection error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
