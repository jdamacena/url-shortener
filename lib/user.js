import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "system_admin"], default: "user" }, // Renamed admin to system_admin
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
