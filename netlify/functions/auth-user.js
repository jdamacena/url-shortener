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

    // Return user info from JWT
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        user: {
          userId: user.userId,
          username: user.username,
          role: user.role,
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching user:", error);

    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Not authenticated" }),
    };
  }
}
