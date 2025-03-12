import React, {useState} from "react";
import {FaSearch, FaTimes} from "react-icons/fa";
import styles from "./Search.module.scss";

interface SearchModuleProps {
  searchTerm: string;
  genres: string[];
  setSearchTerm: (term: string) => void;
  setGenreFilter: (genre: string) => void;
}

const Search: React.FC<SearchModuleProps> = ({searchTerm, genres, setSearchTerm, setGenreFilter}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
      <div className={styles.searchContainer}>
        {/* Icono de búsqueda */}
        {!isSearchOpen && (
            <button className={styles.transparentBackground} onClick={() => setIsSearchOpen(true)}>
              <FaSearch className={styles.searchIcon}/>
            </button>
        )}

        {/* Popup de búsqueda */}
        {isSearchOpen && (
            <div className={styles.searchPopup}>
              <button className={styles.closeButton} onClick={() => setIsSearchOpen(false)}>
                <FaTimes/>
              </button>
              <input
                  type="text"
                  placeholder="Buscar película..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
              />
              <ul className={styles.genreList}>
                {genres.map((cat: string) => (
                    <li key={cat}>
                      <button onClick={() => setGenreFilter(cat)}>{cat}</button>
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default Search;
