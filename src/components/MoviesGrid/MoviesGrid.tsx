import React, { useState, useMemo, useCallback } from "react";
import useMovies, { Categories } from "../../hooks/useMovies";
import { Movie } from "../../../types/Movie";
import styles from "./MoviesGrid.module.scss";
import MovieCard from "./MovieCard";
import Search from "../Search/Search";
import { FaArrowLeft } from "react-icons/fa";

const MoviesGrid: React.FC = () => {
  const movies = useMovies();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  const uniqueMovies = useCallback((moviesList: Movie[]) => {
    const movieMap = new Map();
    moviesList.forEach((movie) => {
      const key = `${movie.name}-${movie.year}`;
      if (!movieMap.has(key) || movie.subtitled) {
        movieMap.set(key, movie);
      }
    });
    return Array.from(movieMap.values());
  }, []);

  const filteredMovies = useMemo(() =>
          searchTerm || genreFilter
              ? uniqueMovies(movies.findMovies({ title: searchTerm || undefined, genre: genreFilter || undefined }))
              : [],
      [searchTerm, genreFilter, movies, uniqueMovies]
  );

  const genres = useMemo(() =>
          uniqueMovies(movies.getMovies())
              .flatMap((movie) => movie.genre.split(','))
              .filter((value, index, array) => array.indexOf(value) === index)
              .filter((g) => g.length)
              .slice(0, 10),
      [movies, uniqueMovies]
  );

  return (
      <div className={styles.container}>
        <Search searchTerm={searchTerm} genres={genres} setSearchTerm={setSearchTerm} setGenreFilter={setGenreFilter} />

        {!filteredMovies.length ? (
            <>
              {["2025", "2024"].map((year) => (
                  <section key={year}>
                    <h1>No te pierdas {year}</h1>
                    <div className={styles.scrollContainer}>
                      {uniqueMovies(movies.findMovies({ year: Number(year) }, 20)).map((movie, index) => (
                          <MovieCard key={movie.id} movie={movie} index={index} />
                      ))}
                    </div>
                  </section>
              ))}

              <h1>Películas</h1>
              <div className={styles.grid}>
                {uniqueMovies(movies.findMovies({ category: Categories.movies })).map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            </>
        ) : (
            <div className={styles.searchResults}>
              <button className={styles.backButtonDetails} onClick={() => setSearchTerm("")}>
                <FaArrowLeft className={styles.backArrow} />
              </button>
              <h2>Resultados de búsqueda</h2>
              <div className={styles.grid}>
                {filteredMovies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default MoviesGrid;
