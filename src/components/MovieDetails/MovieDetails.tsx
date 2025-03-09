import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom"; // Importar useHistory
import {Movie} from "../../types/Movie";
import useMovies from "../../hooks/useMovies";
import styles from "./MovieDetails.module.scss";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const MovieDetails: React.FC = () => {
  const {id} = useParams<{ id: string }>(); // Obtener el ID de la URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const {movies, findMovies} = useMovies();
  const [isWatching, setIsWatching] = useState(false); // Estado para mostrar el video

  useEffect(() => {
    if (id) {
      const movieId = parseInt(id, 10);
      const movieDetails = findMovies({id: movieId});

      if (movieDetails.length > 0) {
        setMovie(movieDetails[0]);
      }
    }
  }, [id, findMovies]);

  if (!movie) return <div>Cargando...</div>;

  return (
      <div className={styles.container}>
        {isWatching ? (
            <VideoPlayer
                videoUrl={movie.url}
                movieTitle={movie.name}
                onExit={() => setIsWatching(false)}
            />
        ) : (
            <div className={styles["movie-details"]}>
              <div className={styles.header}>
                <img
                    src={movie.image}
                    alt={movie.name}
                    className={styles["movie-image"]}
                />
                <div className={styles["movie-info"]}>
                  <h1 className={styles.title}>{movie.name}</h1>
                  <p className={styles.year}>Ańo: {movie.year}</p>
                  <p className={styles.genre}>Género: {movie.genre}</p>
                  <p className={styles.description}>{movie.overview}</p>

                  <p className={styles.description}>{movie.description}</p>

                  <div className={styles.buttons}>
                    <button className="watchNow" onClick={() => setIsWatching(true)}>
                      Ver ahora
                    </button>
                  {/*  <button onClick={() => alert("Añadido a la lista")}>
                      Añadir a lista
                    </button>*/}
                    <button className={styles.backButton} onClick={() => history.back()}>Volver al Menu</button> {/* Botón Volver */}
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default MovieDetails;
