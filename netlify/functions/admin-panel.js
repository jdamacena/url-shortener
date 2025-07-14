import dbConnect from "../../lib/dbConnect.js";
import User from "../../lib/user.js";
import Url from "../../lib/url.js";
import {
  authenticateUser,
  createCorsHeaders,
  handleCors,
} from "./utils/auth.js";

function checkAdminAccess(user) {
  if (!user || user.role !== "system_admin") {
    throw new Error("Forbidden: Admins only");
  }
}

export async function handler(event, context) {
  const headers = createCorsHeaders();

  // Handle CORS preflight
  const corsResponse = handleCors(event, headers);
  if (corsResponse) return corsResponse;

  try {
    // Authenticate user and check admin access
    const user = authenticateUser(event);
    checkAdminAccess(user);

    await dbConnect();

    if (event.httpMethod === "GET") {
      // List all users and their URLs
      const users = await User.find({}, "_id username role createdAt");
      const urls = await Url.find({});

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ users, urls }),
      };
    } else if (event.httpMethod === "DELETE") {
      // Delete a user or a url
      const { userId, urlId } = JSON.parse(event.body);

      if (userId) {
        await User.deleteOne({ _id: userId });
        await Url.deleteMany({ userId });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }

      if (urlId) {
        await Url.deleteOne({ _id: urlId });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "userId or urlId required" }),
      };
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }
  } catch (error) {
    console.error("Admin error:", error);

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

    if (error.message === "Forbidden: Admins only") {
      return {
        statusCode: 403,
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
