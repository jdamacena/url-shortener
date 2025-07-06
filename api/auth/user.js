import authMiddleware from "../../lib/authMiddleware.js";
import corsMiddleware from "../../lib/corsMiddleware.js";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  // Return user info from JWT
  res.json({ user: { userId: req.user.userId, username: req.user.username } });
}

export default corsMiddleware(authMiddleware(handler));
