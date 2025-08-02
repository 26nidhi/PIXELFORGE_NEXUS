import bcrypt from "bcryptjs";
import User from "../models/User.js";

const ensureAdminExists = async () => {
  const admin = await User.findOne({ role: "Admin" });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin",
    });
    console.log("Default Admin created: admin@example.com / 123456");
  }
};

export default ensureAdminExists;
