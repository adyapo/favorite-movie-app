document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("movie-form");
  const apiKey = "fced3ba8";
  const movieList = document.querySelector("#movie-list tbody");
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const image = document.getElementById("image");
  const year = document.getElementById("year");
  const rating = document.getElementById("rating");
  const sort = document.getElementById("sort");
  const search = document.getElementById("search");
  const toggleDisplay = document.getElementById("toggle-display");
  const dateAdded = document.getElementById("dateAdded");

  let displayMode = "list"; // Inițializăm modul de afișare ca 'list'
  let movies = [];

  loadMovies();
  form.addEventListener("submit", addMovie);
  search.addEventListener("input", searchMovie);
  sort.addEventListener("change", sortMovie);
  toggleDisplay.addEventListener("click", toggleDisplayMode);

  function toggleDisplayMode() {
    displayMode = displayMode === "list" ? "table" : "list";
    const tableHeader = document.getElementById("movie-form");
    if (displayMode === "list") {
      tableHeader.style.display = "none";
    } else {
      tableHeader.style.display = "flex";
    }
    renderMovies(movies);
  }

  function loadMovies() {
    let storedMovies = JSON.parse(localStorage.getItem("movies"));
    if (storedMovies !== null) {
      movies = storedMovies;
      renderMovies(movies);
    }
  }

  function addMovie(event) {
    event.preventDefault();
    const newMovie = createMovieObject(
      title.value,
      description.value,
      image.value,
      year.value,
      rating.value,
      getCurrentDateTime()
    );
    movies.push(newMovie);
    renderMovies(movies);
    saveMovies();
    form.reset();
  }
  
  function getCurrentDateTime() {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDateTime.getDate().toString().padStart(2, '0');
    const hours = currentDateTime.getHours().toString().padStart(2, '0');
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  function createMovieObject(title, description, image, year, rating, dateAdded) {
    const movie = {
      title: title,
      description: description,
      image: image,
      year: year,
      rating: rating,
      dateAdded: dateAdded
    };
    return movie;
  }
  
  function renderMovies(movies) {
    movieList.innerHTML = "";
    movies.forEach((movie) => {
      let movieElement;
      if (displayMode === "list") {
        movieElement = createMovieListElement(movie);
      } else {
        movieElement = createMovieTableRow(movie);
      }
      movieList.appendChild(movieElement);
    });
  }

  function createMovieListElement(movie) {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = movie.image;
    img.alt = movie.title;
    li.appendChild(img);

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details");

    const title = document.createElement("h2");
    title.textContent = movie.title;
    detailsDiv.appendChild(title);

    const description = document.createElement("p");
    description.textContent = movie.description;
    detailsDiv.appendChild(description);

    const year = document.createElement("p");
    year.textContent = "Year: " + movie.year;
    detailsDiv.appendChild(year);

    const rating = document.createElement("p");
    rating.textContent = "Rating: " + movie.rating;
    detailsDiv.appendChild(rating);

    const dateAdded = document.createElement("p");
    dateAdded.textContent = "Date Added: " + formatMovieDate(movie.dateAdded);
    detailsDiv.appendChild(dateAdded);

    li.appendChild(detailsDiv);

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteMovie(movie));
    actionsDiv.appendChild(deleteButton);

    const watchedButton = document.createElement("button");
    watchedButton.textContent = "Watched";
    watchedButton.addEventListener("click", () => toggleWatched(movie));
    actionsDiv.appendChild(watchedButton);

    li.appendChild(actionsDiv);

    return li;
  }

  function createMovieTableRow(movie) {
  const tr = document.createElement("tr");
  const imgCell = document.createElement("td");
const img = document.createElement("img");
img.src = movie.image;
img.alt = movie.title;
imgCell.appendChild(img);
tr.appendChild(imgCell);

const titleCell = document.createElement("td");
titleCell.textContent = movie.title;
tr.appendChild(titleCell);

const descriptionCell = document.createElement("td");
descriptionCell.textContent = movie.description;
tr.appendChild(descriptionCell);

const yearCell = document.createElement("td");
yearCell.textContent = movie.year;
tr.appendChild(yearCell);

const ratingCell = document.createElement("td");
ratingCell.textContent = movie.rating;
tr.appendChild(ratingCell);

const dateAddedCell = document.createElement("td");
dateAddedCell.textContent = formatMovieDate(movie.dateAdded);
tr.appendChild(dateAddedCell);

const actionsCell = document.createElement("td");
const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.addEventListener("click", () => deleteMovie(movie));
actionsCell.appendChild(deleteButton);

const watchedButton = document.createElement("button");
watchedButton.textContent = "Watched";
watchedButton.addEventListener("click", () => toggleWatched(movie));
actionsCell.appendChild(watchedButton);

tr.appendChild(actionsCell);

return tr;
}

function formatMovieDate(dateString) {
const date = new Date(dateString);
const options = { year: "numeric", month: "long", day: "numeric" };
return date.toLocaleDateString(undefined, options);
}

function deleteMovie(movie) {
const index = movies.indexOf(movie);
movies.splice(index, 1);
renderMovies(movies);
saveMovies();
}

function toggleWatched(movie) {
movie.watched = !movie.watched;
renderMovies(movies);
saveMovies();
}

function searchMovie(event) {
const searchValue = event.target.value.trim().toLowerCase();
let filteredMovies = movies.filter(
(movie) =>
movie.title.toLowerCase().includes(searchValue) ||
movie.description.toLowerCase().includes(searchValue)
);
renderMovies(filteredMovies);
}

function sortMovie(event) {
const sortValue = event.target.value.split("-");
let sortedMovies = [...movies];
switch (sortValue[0]) {
case "name":
sortedMovies.sort((a, b) =>
sortValue[1] === "asc"
? a.title.localeCompare(b.title)
: b.title.localeCompare(a.title)
);
break;
case "year":
sortedMovies.sort((a, b) =>
sortValue[1] === "asc" ? a.year - b.year : b.year - a.year
);
break;
case "rating":
sortedMovies.sort((a, b) =>
sortValue[1] === "asc" ? a.rating - b.rating : b.rating - a.rating
);
break;
case "date":
sortedMovies.sort((a, b) =>
sortValue[1] === "asc"
? new Date(a.dateAdded) - new Date(b.dateAdded)
: new Date(b.dateAdded) - new Date(a.dateAdded)
);
break;
}
renderMovies(sortedMovies);
}

function saveMovies() {
localStorage.setItem("movies", JSON.stringify(movies));
}
});
