import authMiddleware from "../../lib/authMiddleware.js";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  // TODO: Implement JWT/stateless user lookup
  res.status(401).json({ error: "Not authenticated" });
}

export default authMiddleware(handler);
