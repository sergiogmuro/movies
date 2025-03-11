import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Movie } from "../../types/Movie";
import useMovies from "../../hooks/useMovies";
import styles from "./MovieDetails.module.scss";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import {FaArrowLeft} from "react-icons/fa";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieDetailsFound, setMovieDetailsFound] = useState<Movie[]>([]);
  const { findMovies } = useMovies();
  const [isWatching, setIsWatching] = useState<Movie | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const movieId = parseInt(id, 10);
      const movieDetails = findMovies({ id: movieId });

      if (movieDetails.length > 0) {
        const movieDetail = movieDetails[0];
        setMovie(movieDetail);

        setMovieDetailsFound(
            findMovies({ title: movieDetail.name, category: movieDetail.categoryName })
        );
      }
    }
  }, [id, findMovies]);

  if (!movie) return <div>Cargando...</div>;

  return (
      <div className={styles.container}>
        {isWatching ? (
            <VideoPlayer
                videoUrl={isWatching.url}
                movieTitle={movie.name}
                onExit={() => setIsWatching(undefined)}
            />
        ) : (
            <div className={styles["movie-details"]}>
              <div className={styles.header}>
                <img src={movie.image} alt={movie.name} className={styles["movie-image"]} />
                <div className={styles["movie-info"]}>
                  <FaArrowLeft
                      className={styles.backArrow}
                      onClick={() => navigate(-1)}
                  />
                  <h1 className={styles.title}>{movie.name}</h1>
                  <p className={styles.year}>Año: {movie.year}</p>
                  <p className={styles.genre}>Género: {movie.genre}</p>
                  <p className={styles.description}>{movie.overview}</p>

                  <div className={styles.buttons}>
                    {movieDetailsFound.map((movie) => (
                        <button key={movie.id} className="watchNow" onClick={() => setIsWatching(movie)}>
                          Ver ahora {movie.subtitled ? " - Versión con subtítulos" : ""}
                        </button>
                    ))}
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                      Volver al Menú
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default MovieDetails;
