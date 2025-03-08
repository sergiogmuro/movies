import { Link } from "react-router-dom";
import styles from "./MoviesGrid.module.scss";
import React from "react";
import {Movie} from "../../../types/Movie";
import movieDetails from "../MovieDetails/MovieDetails";

interface MoviewCardInterface {
  movie: Movie,
  index: number
}

const MovieCard = (movieDetails: MoviewCardInterface) => {
  const {movie, index} = movieDetails;
  console.log(movie, movie.subtitled);
  return (
      <Link to={`/movie/${movie.id}`} key={index}>
        <div className={styles.movieCard}>
          <img
              src={movie.image}
              alt={movie.name}
              className={styles.movieImage}
          />
          <h2 className={styles.movieTitle}>{movie.name} {(movie.subtitled) ? '(SUB)' : ''}</h2>
          <p className={styles.moviePopularity}>⭐ {movie?.year}</p>
          <p className={styles.movieGenre}>🎭 {movie?.genre}</p>
        </div>
      </Link>
  )
}


export default MovieCard