
const url = new URL(location.href);

// ✅ SAFE: no .trim() that can crash script
const id = url.searchParams.get("id");
const MovieTitle = url.searchParams.get("title");

console.log("MOVIE ID FROM URL:", id);

// 🔴 STOP everything early if ID is missing
if (!id) {
    alert("Movie ID missing in URL");
    throw new Error("Missing movie ID");
}

const REVIEWS_API = "https://movie-review-web-app-1.onrender.com/api/v1/reviews";

const main = document.getElementById("section");
const titleElement = document.getElementById("title");

titleElement.innerText = MovieTitle || "Movie";

console.log("movie.js loaded successfully");

// =====================
// GET REVIEWS
// =====================
function returnReviews() {
    console.log("Fetching reviews for:", id);

    fetch(`${REVIEWS_API}/movie/${id}`)
        .then(res => res.json())
      .then(data => {
    console.log("Reviews received:", data);

    main.innerHTML = "";

    // 🔴 SAFE CHECK
    if (!Array.isArray(data)) {
        console.error("Invalid response from server:", data);
        main.innerHTML = "<p>Error loading reviews</p>";
        return;
    }

    if (data.length === 0) {
        main.innerHTML = "<p>No reviews yet</p>";
        return;
    }

            data.forEach(review => {
                const div = document.createElement("div");

                div.innerHTML = `
                    <div class="card">
                        <p><strong>User:</strong> ${review.user}</p>
                        <p><strong>Review:</strong> ${review.review}</p>
                        <p><strong>Rating:</strong> ${"⭐".repeat(review.rating || 0)}</p>
                        <p>
                            <a href="#" onclick="deleteReview('${review._id}', '${review.user}')">Delete</a>
                        </p>
                    </div>
                `;

                main.appendChild(div);
            });
        })
        .catch(err => console.error("GET ERROR:", err));
}

// =====================
// SUBMIT REVIEW
// =====================
function submitReview() {
    console.log("Submit clicked");

    const user = document.getElementById("user").value.trim();
    const reviewText = document.getElementById("reviewText").value.trim();
    const rating = Number(document.getElementById("rating").value);

    if (!user || !reviewText || !rating) {
        alert("Please fill in all fields");
        return;
    }

    const payload = {
        movie_id: Number(id),
        user,
        review: reviewText,
        rating
    };

    console.log("Sending POST:", payload);

    fetch(REVIEWS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        console.log("POST response:", data);

        // clear inputs
        document.getElementById("user").value = "";
        document.getElementById("reviewText").value = "";
        document.getElementById("rating").value = "";

        returnReviews();
    })
    .catch(err => console.error("POST ERROR:", err));
}

// =====================
// DELETE REVIEW
// =====================
function deleteReview(reviewId, user) {
    console.log("Deleting review:", reviewId);

    fetch(`${REVIEWS_API}/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user })
    })
    .then(res => res.json())
    .then(data => {
        console.log("DELETE response:", data);
        returnReviews();
    })
    .catch(err => console.error("DELETE ERROR:", err));
}

// =====================
// INIT
// =====================
returnReviews();