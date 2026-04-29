// Gets the URL params from the browser
// e.g. movie.html?id=980431&title=Avatar
const url = new URL(location.href);
const id = url.searchParams.get("id"); // gets "980431"
const MovieTitle = url.searchParams.get("title"); // gets "Avatar"

// =====================
// NAVBAR AUTH
// =====================
// Reads token and username saved during login
// token = JWT token that proves who you are
// username = the actual username e.g. "Naledi"
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

// Stop everything if movie ID is missing in the URL
if (!id) {
    alert("Movie ID missing in URL");
    throw new Error("Missing movie ID");
}

// Your backend API on Render
const REVIEWS_API = "https://movie-review-web-app-1.onrender.com/api/v1/reviews";

// Gets the HTML elements we need to update
const main = document.getElementById("section");
const titleElement = document.getElementById("title");
const navUser = document.getElementById("navUser");

// Sets the movie title on the page
titleElement.innerText = MovieTitle || "Movie";

// If no token = not logged in = show Login link
// If token = logged in = show profile link and Logout button
if (!token) {
    navUser.innerHTML = `<a href="login.html">Login</a>`;
} else {
    // Clicking the username takes them to their profile page
    navUser.innerHTML = `
        <a href="profile.html" style="color:white; padding: 10px;">👤 ${username}</a>
        <a href="#" onclick="logout()">Logout</a>
    `;
}

// Removes token and username from localStorage = logs user out
// Then redirects them to the login page
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

// =====================
// REVIEW FORM AUTH GATE
// =====================
// If not logged in - hide the form and show login prompt instead
// If logged in - show the form with their username
if (!token) {
    // hides the review form
    document.getElementById("reviewFormSection").style.display = "none";
    // shows the "please login" message
    document.getElementById("loginPrompt").style.display = "block";
} else {
    // Shows "Reviewing as: Naledi" above the form
    document.getElementById("loggedInAs").innerText = `Reviewing as: ${username}`;
}

// =====================
// GET REVIEWS
// =====================
function returnReviews() {
    console.log("Fetching reviews for:", id);

    // Calls GET /api/v1/reviews/movie/980431
    // Returns all reviews for this specific movie
    fetch(`${REVIEWS_API}/movie/${id}`)
        .then(res => res.json()) // converts response to JSON
        .then(data => {
            console.log("Reviews received:", data);

            main.innerHTML = ""; // clears section before adding reviews

            // Safety check - make sure we got an array back
            if (!Array.isArray(data)) {
                console.error("Invalid response from server:", data);
                main.innerHTML = "<p>Error loading reviews</p>";
                return;
            }

            // If no reviews yet show a message
            if (data.length === 0) {
                main.innerHTML = "<p>No reviews yet</p>";
                return;
            }

            // Loop through each review and create a card for it
            data.forEach(review => {
                const div = document.createElement("div");

                // isOwner checks if the logged in user wrote this review
                // If yes - show the delete button
                // If no - hide the delete button
                const isOwner = username && review.user === username;

                div.innerHTML = `
                    <div class="card">
                        <p><strong>User:</strong> ${review.user}</p>
                        <p><strong>Review:</strong> ${review.review}</p>
                        <p><strong>Rating:</strong> ${"⭐".repeat(review.rating || 0)}</p>
                        ${isOwner ? `
                        <p>
                            <a href="#" onclick="deleteReview('${review._id}', '${review.user}')">Delete</a>
                        </p>` : ""}
                    </div>
                `;

                main.appendChild(div); // adds card to the page
            });
        })
        .catch(err => console.error("GET ERROR:", err));
}

// =====================
// SUBMIT REVIEW
// =====================
function submitReview() {
    // Gets what the user typed in the form
    // trim() removes accidental spaces at the start/end
    const reviewText = document.getElementById("reviewText").value.trim();

    // Number() converts "5" (string) to 5 (actual number)
    const rating = Number(document.getElementById("rating").value);

    // Stop and alert if any field is empty
    if (!reviewText || !rating) {
        alert("Please fill in all fields");
        return; // stops the function here
    }

    // This is the data we send to the backend
    const payload = {
        movie_id: Number(id), // the movie ID from the URL
        user: username, // comes from localStorage automatically
        review: reviewText,
        rating
    };

    console.log("Sending POST:", payload);

    // Sends the review to your backend API
    fetch(REVIEWS_API, {
        method: "POST", // POST = we are sending new data
        headers: { 
            "Content-Type": "application/json", // tells backend we are sending JSON
            "Authorization": `Bearer ${token}`
            // sends the JWT token so backend knows who you are
            // Bearer is the standard way to send tokens in HTTP
        },
        body: JSON.stringify(payload)
        // JSON.stringify converts the payload object into a JSON string
        // e.g. {movie_id: 980431} becomes '{"movie_id":980431}'
    })
    .then(res => res.json()) // converts response to JSON
    .then(data => {
        console.log("POST response:", data);

        // Clears the form after successful submit
        document.getElementById("reviewText").value = "";
        document.getElementById("rating").value = "";

        returnReviews(); // refreshes the reviews list
    })
    .catch(err => console.error("POST ERROR:", err));
    // catch handles any network errors
}

// =====================
// DELETE REVIEW
// =====================
function deleteReview(reviewId, user) {
    console.log("Deleting review:", reviewId);

    // Calls DELETE /api/v1/reviews/reviewId
    fetch(`${REVIEWS_API}/${reviewId}`, {
        method: "DELETE", // DELETE = we are removing data
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }) // sends the username to verify ownership
    })
    .then(res => res.json())
    .then(data => {
        console.log("DELETE response:", data);
        returnReviews(); // refreshes reviews after deleting
    })
    .catch(err => console.error("DELETE ERROR:", err));
}

// =====================
// INIT - runs when page first loads
// =====================
returnReviews();