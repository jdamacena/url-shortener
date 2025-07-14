import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";
import {
  authenticateUser,
  createCorsHeaders,
  handleCors,
} from "./utils/auth.js";

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
    // Authenticate user
    const user = authenticateUser(event);

    await dbConnect();
    const urls = await Url.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .limit(150);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(urls),
    };
  } catch (error) {
    console.error("Error fetching URLs:", error);

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
