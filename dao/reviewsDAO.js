import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

  static async injectDB(conn) {
    if (reviews) return;
    try {
      reviews = await conn.db("movies").collection("reviews");
      console.log("ReviewsDAO: connected to 'reviews' collection");
    } catch (e) {
      console.error("ReviewsDAO injectDB failed:", e);
    }
  }

  static async addReview(movieId, user, review, rating) {
    try {
      return await reviews.insertOne({
        movie_id: Number(movieId),
        user,
        review,
        rating: Number(rating),
        date: new Date()
      });
    } catch (e) {
      console.error("addReview error:", e);
      throw e;
    }
  }

  static async getReviews(movieId) {
    try {
      return await reviews.find({ movie_id: Number(movieId) }).toArray();
    } catch (e) {
      console.error("getReviews error:", e);
      throw e;
    }
  }

  static async deleteReview(reviewId, user) {
    try {
      return await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user
      });
    } catch (e) {
      console.error("deleteReview error:", e);
      throw e;
    }
  }
}