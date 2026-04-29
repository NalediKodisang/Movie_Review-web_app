import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersDAO from "../dao/usersDAO.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export default class AuthController {

  static async register(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password)
        return res.status(400).json({ error: "All fields required" });

      // Check if username is already taken
      const existing = await UsersDAO.getUserByUsername(username);
      if (existing)
        return res.status(400).json({ error: "Username already taken" });

      // Hash the password before saving
      // 10 = how many times it scrambles the password
      // More times = more secure but slower
      const hashed = await bcrypt.hash(password, 10);

      // Save user with default role of "user"
      await UsersDAO.addUser(username, hashed, "user");

      res.json({ success: true, message: "Account created! Please log in." });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Find user in database
      const user = await UsersDAO.getUserByUsername(username);
      if (!user)
        return res.status(400).json({ error: "Invalid username or password" });

      // Compare the password with the hashed one in the database
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ error: "Invalid username or password" });

      // Create a JWT token that includes username AND role
      // This is how the frontend knows if someone is admin
      const token = jwt.sign(
        { username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Send back the token, username AND role
      res.json({ 
        success: true, 
        token, 
        username: user.username,
        role: user.role // ✅ sending role to frontend
      });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Gets all users - admin only
static async getAllUsers(req, res) {
    try {
        const allUsers = await UsersDAO.getAllUsers();
        // Remove passwords before sending - never expose passwords!
        const safeUsers = allUsers.map(user => ({
            username: user.username,
            role: user.role,
            date: user.date
        }));
        res.json(safeUsers);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
}