import express from "express";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

// GET reviews for a specific movie
router.get("/movie/:id", (req, res) => {
    ReviewsCtrl.apiGetReview(req, res);
});

// POST a new review
router.post("/", (req, res) => {
    ReviewsCtrl.apiPostReviews(req, res);
});

// DELETE a review
router.delete("/:id", (req, res) => {
    ReviewsCtrl.apiDeleteReview(req, res);
});

// GET all reviews by a specific user - for profile page
router.get("/user/:username", (req, res) => {
    ReviewsCtrl.apiGetUserReviews(req, res);
});

export default router;