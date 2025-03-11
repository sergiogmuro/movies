import { Link } from "react-router-dom";
import styles from "./MoviesGrid.module.scss";
import React from "react";
import {Movie} from "../../../types/Movie";
import movieDetails from "../MovieDetails/MovieDetails";

interface MoviewCardInterface {
  movie: Movie,
  index: number
}

const SHOW_TOTAL_GENRES = 2

const MovieCard = (movieDetails: MoviewCardInterface) => {
  const {movie, index} = movieDetails;

  return (
      <Link to={`/movie/${movie.id}`} key={index}>
        <div className={styles.movieCard}>
          <img
              src={movie.image.replace('t/p/original', 't/p/w300')}
              alt={movie.name}
              className={styles.movieImage}
              loading="lazy" // Lazy loading aplicado
          />
          <h2 className={styles.movieTitle}>{movie.name}</h2>
          <p className={styles.moviePopularity}>⭐ {movie?.year}</p>
          <p className={styles.movieGenre}>🎭 {movie?.genre.split(',').slice(0, SHOW_TOTAL_GENRES).join(', ')}</p>
        </div>
      </Link>
  )
}


export default MovieCard