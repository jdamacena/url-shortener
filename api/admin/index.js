import dbConnect from "../../lib/dbConnect.js";
import User from "../../lib/user.js";
import Url from "../../lib/url.js";
import authMiddleware from "../../lib/authMiddleware.js";
import corsMiddleware from "../../lib/corsMiddleware.js";

// Only allow admin users (by username, for now)
const ADMIN_USERNAMES = [process.env.ADMIN_USERNAME || "admin"];

function adminOnly(handler) {
  return async (req, res) => {
    if (!req.user || !ADMIN_USERNAMES.includes(req.user.username)) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    return handler(req, res);
  };
}

async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    // List all users and their URLs
    const users = await User.find({}, "_id username");
    const urls = await Url.find({});
    res.json({ users, urls });
  } else if (req.method === "DELETE") {
    // Delete a user or a url
    const { userId, urlId } = req.body;
    if (userId) {
      await User.deleteOne({ _id: userId });
      await Url.deleteMany({ userId });
      return res.json({ success: true });
    }
    if (urlId) {
      await Url.deleteOne({ _id: urlId });
      return res.json({ success: true });
    }
    return res.status(400).json({ error: "userId or urlId required" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default corsMiddleware(authMiddleware(adminOnly(handler)));
