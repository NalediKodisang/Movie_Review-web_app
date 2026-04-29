const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=ffd1176396836c78b6107250dc22aaa0&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=ffd1176396836c78b6107250dc22aaa0&query=";

// Gets the HTML elements we need
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

// =====================
// NAVBAR AUTH
// =====================
// Reads token and username saved during login
// token = the JWT token that proves who you are
// username = the actual username e.g. "Naledi"
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

// Gets the empty navUser div in the navbar
const navUser = document.getElementById("navUser");

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
// LOAD MOVIES
// =====================
// Runs immediately when page loads
// Fetches popular movies from TMDB API
returnMovies(APILINK);

function returnMovies(url) {
    fetch(url)
    .then(res => res.json()) // converts response to JSON
    .then(function(data) {
        console.log(data.results);

        main.innerHTML = ""; // clears the section before adding movies

        // Creates a row div to hold all the movie cards
        const div_row = document.createElement("div");
        div_row.setAttribute("class", "row");

        // Loops through each movie and creates a card for it
        data.results.forEach(element => {
            // Creates the card and column divs
            const div_card = document.createElement("div");
            div_card.setAttribute("class", "card");

            const div_column = document.createElement("div");
            div_column.setAttribute("class", "column");

            // Creates the movie poster image
            const image = document.createElement("img");
            image.setAttribute("class", "thumbnail");

            const title = document.createElement("h5");
            const center = document.createElement("div");

            // Sets the movie title and a link to the reviews page
            // encodeURIComponent makes the title safe to put in a URL
            // e.g. "Avatar: The Last Airbender" becomes "Avatar%3A%20The%20Last%20Airbender"
            title.innerHTML = `
                ${element.title} <br>
                <a href="movie.html?id=${element.id}&title=${encodeURIComponent(element.title)}">
                    See Reviews
                </a>
            `;

            // If movie has a poster use it, otherwise use a placeholder
            if (element.poster_path) {
                image.src = IMGPATH + element.poster_path;
            } else {
                image.src = "https://via.placeholder.com/300";
            }

            // Builds the card structure
            center.appendChild(image);
            div_card.appendChild(center);
            div_card.appendChild(title);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);
        });

        main.appendChild(div_row); // adds all cards to the page
    })
    .catch(err => console.log(err)); // handles any network errors
}

// =====================
// SEARCH
// =====================
form.addEventListener("submit", (e) => {
    // Stops the page from refreshing when form is submitted
    e.preventDefault();
    main.innerHTML = "";

    const searchItem = search.value;

    // Only search if there is something typed in the search box
    if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = ""; // clears the search box after searching
    }
});