import express from "express";
import cors from "cors";
import reviews from "./api/reviews.route.js";
import auth from "./api/auth.route.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(__dirname));

// API routes
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/auth", auth);

// ✅ Catch all - serve index.html for any unknown route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

export default app;