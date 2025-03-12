import React, { useState } from "react";
import useMovies, { Categories } from "../../hooks/useMovies";
import { Movie } from "../../../types/Movie";
import styles from "./MoviesGrid.module.scss";
import MovieCard from "./MovieCard";
import Search from "../Search/Search";
import {FaArrowLeft} from "react-icons/fa";

const MoviesGrid: React.FC = () => {
  const moviesList = useState<Movie[]>({});
  const movies = useMovies();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  const uniqueMovies = (moviesList: Movie[]) => {
    const movieMap = new Map();

    moviesList.forEach((movie) => {
      const key = `${movie.name}-${movie.year}`;
      if (!movieMap.has(key) || (movieMap.has(key) && movie.subtitled)) {
        movieMap.set(key, movie);
      }
    });

    return Array.from(movieMap.values());
  };

  const filteredMovies = (searchTerm || genreFilter) ? uniqueMovies(movies.findMovies({
    title: searchTerm || undefined,
    genre: genreFilter || undefined
  })) : [];
  const genres = movies ? uniqueMovies(movies.getMovies()).flatMap((movie: Movie) => movie.genre.split(',')).filter(onlyUnique).filter(g => g.length).slice(0, 10) : [];

  return (
      <div className={styles.container}>
        {/* Componente de Búsqueda */}
        <Search searchTerm={searchTerm} genres={genres} setSearchTerm={setSearchTerm}setGenreFilter={setGenreFilter} />

        {/* Mostrar películas si no hay búsqueda */}
        {filteredMovies.length === 0 && (
            <>
              <h1>No te pierdas 2025</h1>
              <div className={styles.scrollContainer}>
                {uniqueMovies(movies.findMovies({ year: 2025 }, 20)).map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>

              <h1>No te pierdas 2024</h1>
              <div className={styles.scrollContainer}>
                {uniqueMovies(movies.findMovies({ year: 2024 }, 20)).map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>

              <h1>Películas</h1>
              <div className={styles.grid}>
                {uniqueMovies(movies.findMovies({ category: Categories.movies })).map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            </>
        )}

        {/* Mostrar resultados de búsqueda */}
        {filteredMovies.length > 0 && (
            <div className={styles.searchResults}>
              <button className={styles.backButtonDetails} onClick={() => setSearchTerm("")}>
                <FaArrowLeft
                    className={styles.backArrow}
                />
              </button>
              <h2>Resultados de búsqueda</h2>
              <div className={styles.grid}>
                {filteredMovies.map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index}/>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default MoviesGrid;
