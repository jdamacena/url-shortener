import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";

export async function handler(event, context) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    await dbConnect();
    const { shortId } = event.pathParameters;

    const url = await Url.findOne({
      shortUrl: shortId,
      active: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    });

    if (!url) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Short URL not found or expired" }),
      };
    }

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
