import { Link } from "react-router-dom";
import styles from "./MoviesGrid.module.scss";
import React from "react";
import { Movie } from "../../../types/Movie";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const SHOW_TOTAL_GENRES = 2;

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
      <Link to={`/movie/${movie.id}`}>
        <div className={styles.movieCard}>
          <img
              src={movie.image.replace("t/p/original", "t/p/w200")}
              alt={movie.name}
              className={styles.movieImage}
              loading="lazy"
          />
          <h2 className={styles.movieTitle}>{movie.name}</h2>
          <p className={styles.moviePopularity}>{movie.year}</p>
          <p className={styles.movieGenre}>
            {movie.genre.split(",").slice(0, SHOW_TOTAL_GENRES).join(", ")}
          </p>
        </div>
      </Link>
  );
};

export default MovieCard;
