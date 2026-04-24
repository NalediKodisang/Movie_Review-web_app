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
}