import { IoIosSearch } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import "./App.css";
import { useRef, useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

function calculateTotalPages(totalResults) {
  if (!totalResults) return 0;
  return Math.ceil(totalResults / 10);
}

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(result?.totalResults);
  const searchTerm = useRef(null);
  const [input, setInput] = useState("");

  async function fetchData(query, page) {
    const params = new URLSearchParams();
    params.set("s", query);
    params.set("apikey", "c6c58cb8");
    params.set("page", page);

    setLoading(true);
    const response = await fetch(
      "https://www.omdbapi.com?" + params.toString()
    );
    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  async function handlePagination(page) {
    await fetchData(searchTerm.current, page);
    setPage(page);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const input = formData.get("input");
    searchTerm.current = input;
    await fetchData(input, 1);
    setPage(1);
  }

  useEffect(() => {
    if (!input) return;

    const timer = setTimeout(() => {
      searchTerm.current = input;
      fetchData(input, 1).then(() => {
        setPage(1);
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <>
      <h2 className="movie__title">Movie Search App</h2>
      <main className="movie__container">
        <form className="movie__form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="input">
            Search Movie
          </label>
          <input
            className="movie__form-input"
            type="text"
            id="input"
            name="input"
            placeholder="Search for movies..."
            value={input}
            onChange={async (event) => {
              const query = event.target.value;
              setInput(query);
            }}
          />
          <button className="movie__search" type="submit" disabled={loading}>
            {loading ? (
              <ImSpinner2 className="search-spinner" fontSize={24} />
            ) : (
              <IoIosSearch fontSize={24} />
            )}
          </button>
        </form>
        {result?.Response === "False" ? (
          <span className="movie__error">{result.Error}</span>
        ) : null}
        <div
          className="movie__results"
          style={{ opacity: loading ? 0.5 : undefined }}
        >
          {result?.Search?.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
        {totalPages > 1 && (
          <footer className="movie__footer">
            <button
              disabled={page <= 1 || loading}
              className="pagination__button"
              onClick={() => handlePagination(page - 1)}
            >
              <IoChevronBackOutline fontSize={22} />
            </button>
            <span className="pagination__text">
              Page of {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages || loading}
              className="pagination__button"
              onClick={() => handlePagination(page + 1)}
            >
              <IoChevronForwardOutline fontSize={22} />
            </button>
          </footer>
        )}
      </main>
    </>
  );
}

export default App;

function MovieCard({ movie }) {
  return (
    <div className="card">
      <div className="card__img-container">
        <img
          src={movie.Poster === "N/A" ? "/placeholder.png" : movie.Poster}
          alt=""
        />
      </div>
      <div className="card__meta">
        <h3 className="meta__title">{movie.Title}</h3>
        <p className="meta__year">{movie.Year}</p>
        <p className="meta__type">{movie.Type}</p>
      </div>
      <p className="meta__imdb">IMDb ID: {movie.imdbID}</p>
    </div>
  );
}
