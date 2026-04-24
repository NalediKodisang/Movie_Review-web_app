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

      const existing = await UsersDAO.getUserByUsername(username);
      if (existing)
        return res.status(400).json({ error: "Username already taken" });

      const hashed = await bcrypt.hash(password, 10);
      await UsersDAO.addUser(username, hashed);

      res.json({ success: true, message: "Account created! Please log in." });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await UsersDAO.getUserByUsername(username);
      if (!user)
        return res.status(400).json({ error: "Invalid username or password" });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ error: "Invalid username or password" });

      const token = jwt.sign(
        { username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ success: true, token, username: user.username });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}