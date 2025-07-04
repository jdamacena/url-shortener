import corsMiddleware from "../../lib/corsMiddleware.js";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  // TODO: Implement JWT/stateless logout if needed
  res.json({ message: "Logged out successfully" });
}

export default corsMiddleware(handler);
