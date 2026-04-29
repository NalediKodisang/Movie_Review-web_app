import express from "express";
import AuthController from "./auth.controller.js";

const router = express.Router();

router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));
// GET all users - admin only
router.get("/users", (req, res) => AuthController.getAllUsers(req, res));

export default router;