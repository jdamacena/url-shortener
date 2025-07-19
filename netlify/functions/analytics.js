import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";
import {
  authenticateUser,
  createCorsHeaders,
  handleCors,
} from "./utils/auth.js";
import { getPathSegments } from "./utils/path.js";

export async function handler(event, context) {
  const headers = createCorsHeaders();

  // Handle CORS preflight
  const corsResponse = handleCors(event, headers);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const user = authenticateUser(event);

    const pathSegments = getPathSegments(event);
    const shortUrl = pathSegments[pathSegments.length - 1] || "";

    await dbConnect();
    const url = await Url.findOne({ shortUrl, userId: user.userId });

    if (!url) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "URL not found" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(url),
    };
  } catch (error) {
    console.error("Error fetching URL analytics:", error);

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
