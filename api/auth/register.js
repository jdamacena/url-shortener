import dbConnect from "../../lib/dbConnect.js";
import User from "../../lib/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import corsMiddleware from "../../lib/corsMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    await dbConnect();
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "This username is already taken" });
    }
    // If this is the first user, make them system_admin
    const userCount = await User.countDocuments();
    let role = "user";
    if (userCount === 0) {
      role = "system_admin";
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default corsMiddleware(handler);
