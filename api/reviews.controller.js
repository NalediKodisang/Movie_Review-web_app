import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {

  static async apiPostReviews(req, res) {
    try {
      console.log("POST BODY:", req.body);

      const movieId = req.body.movie_id;
      const user = req.body.user;
      const review = req.body.review;
      const rating = req.body.rating;

      if (!movieId || !user || !review || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await ReviewsDAO.addReview(movieId, user, review, rating);
      res.json({ success: true, data: response });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReview(req, res) {
    try {
      const id = req.params.id;
      console.log("GET reviews for movie_id:", id);

      const reviews = await ReviewsDAO.getReviews(id);
      console.log("Found reviews:", reviews);

      res.json(reviews || []);

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res) {
    try {
      const reviewId = req.params.id;
      const user = req.body.user;

      const response = await ReviewsDAO.deleteReview(reviewId, user);
      res.json({ success: true, data: response });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  
   // Gets all reviews for a specific user
// Called when someone visits their profile page
static async apiGetUserReviews(req, res) {
    try {
        const username = req.params.username;
        console.log("GET reviews for user:", username);

        const userReviews = await ReviewsDAO.getReviewsByUser(username);
        console.log("Found user reviews:", userReviews);

        res.json(userReviews || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// Gets ALL reviews in the database
// Only admin should be able to call this
static async apiGetAllReviews(req, res) {
    try {
        // Calls getAllReviews from the DAO
        // Returns every review from every movie
        const allReviews = await ReviewsDAO.getAllReviews();
        res.json(allReviews || []);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// Admin delete - can delete ANY review
// Regular delete only works if you own the review
static async apiAdminDeleteReview(req, res) {
    try {
        const reviewId = req.params.id;
        // Calls deleteReviewById which doesnt check ownership
        const response = await ReviewsDAO.deleteReviewById(reviewId);
        res.json({ success: true, data: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

}