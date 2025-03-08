import React from "react";
import useMovies, {Categories} from "../../hooks/useMovies";
import {Movie} from "../../../types/Movie";
import styles from "./MoviesGrid.module.scss";
import MovieCard from "./MovieCard";

const MoviesGrid: React.FC = () => {
  const movies = useMovies();

  return (
      <div className={styles.container}>
        <h1>10 de 2025</h1>
        <div className={styles.grid}>
          {movies.findMovies({year: 2025}, 10).map((movie: Movie, index) => (
              <MovieCard movie={movie} index={index}/>
          ))}
        </div>
        <h1>10 de 2024</h1>
        <div className={styles.grid}>
          {movies.findMovies({year: 2024}, 10).map((movie: Movie, index) => (
              <MovieCard movie={movie} index={index}/>
          ))}
        </div>
        <h1>Peliculas</h1>
        <div className={styles.grid}>
          {movies.findMovies({category: Categories.movies}, 10000).map((movie: Movie, index) => (
              <MovieCard movie={movie} index={index}/>
          ))}
        </div>
      </div>
  );
};

export default MoviesGrid;
