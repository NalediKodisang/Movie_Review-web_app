const APILINK = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=ffd1176396836c78b6107250dc22aaa0&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=ffd1176396836c78b6107250dc22aaa0&query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

returnMovies(APILINK);

function returnMovies(url){
    fetch(url)
    .then(res => res.json())
    .then(function(data){
        console.log(data.results);

        main.innerHTML = "";

        const div_row = document.createElement("div");
            div_row.setAttribute("class","row");

        data.results.forEach(element => {
            const div_card = document.createElement("div");
            div_card.setAttribute("class","card");

        

            const div_column = document.createElement("div");
            div_column.setAttribute("class","column");

            const image = document.createElement("img");
            image.setAttribute("class","thumbnail");

            const title = document.createElement("h5");

            const center = document.createElement("div");

            title.innerHTML = `
  ${element.title} <br>
  <a href="movie.html?id=${element.id}&title=${encodeURIComponent(element.title)}">
    See Reviews
  </a>
`;
            
            if(element.poster_path){
    image.src = IMGPATH + element.poster_path;
} else {
    image.src = "https://via.placeholder.com/300";
}

            center.appendChild(image);
            div_card.appendChild(center);
            div_card.appendChild(title);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);
           
        });
         main.appendChild(div_row);
    })
    .catch(err => console.log(err));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = "";

    const searchItem = search.value;

    if(searchItem){
        returnMovies(SEARCHAPI + searchItem);
        search.value = "";
    }
});