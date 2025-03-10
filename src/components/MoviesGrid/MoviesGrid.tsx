import React, { useState } from "react";
import useMovies, { Categories } from "../../hooks/useMovies";
import { Movie } from "../../../types/Movie";
import styles from "./MoviesGrid.module.scss";
import MovieCard from "./MovieCard";
import { FaSearch } from "react-icons/fa";

const MoviesGrid: React.FC = () => {
  const movies = useMovies();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMovies = searchTerm ? movies.findMovies({ title: searchTerm }) : [];

  return (
      <div className={styles.container}>
        {/* Search Icon */}
        <div className={styles.searchIcon} onClick={() => setIsSearchOpen(true)}>
          <FaSearch size={20} />
        </div>

        {/* Search Popup */}
        {isSearchOpen && (
            <div className={styles.searchPopup}>
              <input
                  type="text"
                  placeholder="Buscar película..."
                  value={searchTerm}
                  onChange={handleSearchChange}
              />
              <button onClick={() => setIsSearchOpen(false)}>Cerrar</button>
            </div>
        )}

        {!isSearchOpen && filteredMovies.length === 0 && (
            <>
              <h1>No te pierdas 2025</h1>
              <div className={styles.scrollContainer}>
                {movies.findMovies({ year: 2025 }, 12).map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>

              <h1>No te pierdas 2024</h1>
              <div className={styles.scrollContainer}>
                {movies.findMovies({ year: 2024 }, 8).map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>

              <h1>Películas</h1>
              <div className={styles.grid}>
                {movies.findMovies({ category: Categories.movies }).map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            </>
        )}

        {/* Mostrar resultados de búsqueda si hay términos ingresados */}
        {searchTerm && (
            <div className={styles.searchResults}>
              <h2>Resultados de búsqueda</h2>
              <div className={styles.grid}>
                {filteredMovies.map((movie: Movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default MoviesGrid;
