import React, {useEffect, useRef, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Movie} from "../../types/Movie";
import useMovies from "../../hooks/useMovies";
import styles from "./MovieDetails.module.scss";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import {FaArrowLeft} from "react-icons/fa";
import { APP_NAME } from "../../App";

const MovieDetails: React.FC = () => {
  const {hash} = useParams<{ hash: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieDetailsFound, setMovieDetailsFound] = useState<Movie[]>([]);
  const {findMovies} = useMovies();
  const [isWatching, setIsWatching] = useState<Movie | undefined>(undefined);
  const navigate = useNavigate();
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    firstButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (movie) {
      document.title = `${movie.name} | ${APP_NAME}`;
    }
    return () => {
      document.title = APP_NAME;
    };
  }, [movie]);

  useEffect(() => {
    if (hash) {
      const movieId = hash;
      const movieDetails = findMovies({hash: movieId});

      if (movieDetails.length > 0) {
        if (movie !== movieDetails[0]) {
          const movieDetail = movieDetails[0];
          setMovie(movieDetail);

          setMovieDetailsFound(
              findMovies({hash: movieDetail.hash, category: movieDetail.categoryName}, 4, true)
          );
        }
      }
    }
  }, [hash, findMovies]);

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
                <img src={movie.image} alt={movie.name} className={styles["movie-image"]}/>
                <div className={styles["movie-info"]}>
                  <button className={styles.backButtonDetails} onClick={() => navigate(-1)}>
                    <FaArrowLeft
                        className={styles.backArrow}
                    />
                  </button>
                  <h1 className={styles.title}>{movie.name}</h1>
                  <p className={styles.year}><strong>Año</strong>: {movie.year}</p>
                  <p className={styles.genre}><strong>Género</strong>: {movie.genre.split(',').join(', ')}</p>
                  <p className={styles.description}>{movie.overview}</p>

                  <div className={styles.buttons}>
                    {movieDetailsFound.map((movie, index) => (
                        <button
                            key={movie.id}
                            ref={index === 0 ? firstButtonRef : null}
                            className="watchNow" onClick={() => setIsWatching(movie)}>
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
