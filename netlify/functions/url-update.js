import dbConnect from "../../lib/dbConnect.js";
import Url from "../../lib/url.js";
import {
  authenticateUser,
  createCorsHeaders,
  handleCors,
} from "./utils/auth.js";
import { getPublicPath } from "./utils/path.js";

export async function handler(event, context) {
  const headers = createCorsHeaders();

  const corsResponse = handleCors(event, headers);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== "PATCH") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const user = authenticateUser(event);
    await dbConnect();

    // Extract shortId from public path
    const publicPath = getPublicPath(event);
    const shortId = publicPath.replace(/^\/api\/url\//, "");
    
    const updateData = JSON.parse(event.body);

    if (!shortId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "shortId is required" }),
      };
    }

    // Validate that only allowed fields are being updated
    const allowedFields = ["originalUrl", "active", "expiresAt"];
    const updateFields = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updateFields[key] = value;
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No valid fields to update" }),
      };
    }

    const url = await Url.findOneAndUpdate(
      { shortId, userId: user.userId },
      updateFields,
      { new: true }
    );

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
    console.error("Error updating URL:", error);

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
