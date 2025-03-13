import {Link} from "react-router-dom";
import styles from "./MoviesGrid.module.scss";
import React from "react";
import {Movie} from "../../../types/Movie";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const SHOW_TOTAL_GENRES = 2;

const MovieCard: React.FC<MovieCardProps> = React.memo(({movie, index}) => {
  return (
      <Link to={`/movie/${movie.id}`} tabIndex={index}>
        <div className={styles.movieCard}>
          <img
              src={movie.image.replace("t/p/original", "t/p/w200")}
              alt={movie.name}
              className={styles.movieImage}
              loading="lazy"
          />
          <div className={styles.movieDetails}>
            <h2 className={styles.movieTitle}>{movie.name}</h2>
            <p className={styles.moviePopularity}>{movie.year}</p>
            <p className={styles.movieGenre}>
              {movie.genre.split(",").slice(0, SHOW_TOTAL_GENRES).join(", ")}
            </p>
          </div>
        </div>
      </Link>
  );
});

export default MovieCard;
