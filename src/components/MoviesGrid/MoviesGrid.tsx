import React, {useState, useMemo, useCallback, Suspense} from "react";
import useMovies, {Categories} from "../../hooks/useMovies";
import {Movie} from "../../../types/Movie";
import styles from "./MoviesGrid.module.scss";

const MovieCard = React.lazy(() => import("./MovieCard"));
import Search from "../Search/Search";
import {FaArrowLeft} from "react-icons/fa";
import Loading from "../Loading/Loading";
import MovieCardLazy from "./MovieCardLazy";

const MoviesGrid: React.FC = () => {
  const movies = useMovies();
  const loading = movies.loading;
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  const uniqueMovies = useMemo(() => {
    return (moviesList: Movie[]) => {
      const movieMap = new Map();
      moviesList.forEach((movie) => {
        const key = `${movie.name}-${movie.year}`;
        if (!movieMap.has(key) || movie.subtitled) {
          movieMap.set(key, movie);
        }
      });
      return Array.from(movieMap.values());
    };
  }, []);

  const filteredMovies = useMemo(() => {
    if (!searchTerm && !genreFilter) return [];
    return uniqueMovies(movies.findMovies({title: searchTerm || undefined, genre: genreFilter || undefined}));
  }, [searchTerm, genreFilter, movies]);

  const genres = useMemo(() => {
    return uniqueMovies(movies.getMovies())
        .flatMap((movie) => movie.genre?.split(',') ?? [])
        .filter((value, index, array) => array.indexOf(value) === index)
        .slice(0, 10);
  }, [movies]);

  const resetFilters = () => {
    setSearchTerm("");
    setGenreFilter("")
  }


  return (
      <div className={styles.container}>
        <Loading isLoaded={loading}/>
        <Search searchTerm={searchTerm} genres={genres} setSearchTerm={setSearchTerm} setGenreFilter={setGenreFilter}/>

        {!filteredMovies.length ? (
            <>
              {["2025"].map((year) => (
                  <section key={year}>
                    <h1>Estrenos</h1>
                    <div className={styles.scrollContainer}>
                      {uniqueMovies(movies.findMovies({year: Number(year)}, 20)).map((movie, index) => (
                          <MovieCard key={movie.id} movie={movie} index={index}/>
                      ))}
                    </div>
                  </section>
              ))}
              <section key={`added`}>
                <h1>Recien Agregadas</h1>
                <div className={styles.scrollContainer}>
                  {uniqueMovies(movies.findMovies({category: Categories.movies}, 20, false, `publishDate`)).map((movie, index) => (
                      <MovieCard key={movie.id} movie={movie} index={index}/>
                  ))}
                </div>
              </section>

              <h1>Películas</h1>
              <div className={styles.grid}>
                {uniqueMovies(movies.findMovies({category: Categories.movies}, 200)).map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index}/>
                ))}
              </div>

              <div className={styles.showMoreMessage}>
                <h3>Usa el buscador para ver más</h3>
              </div>
            </>
        ) : (
            <div className={styles.searchResults}>
              <button className={styles.backButtonDetails} onClick={() => resetFilters()}>
                <FaArrowLeft className={styles.backArrow}/>
              </button>
              <h2>Resultados de búsqueda</h2>
              <div className={styles.grid}>
                {filteredMovies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index}/>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default MoviesGrid;
