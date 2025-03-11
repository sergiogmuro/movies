import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./Search.module.scss";

interface SearchModuleProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search: React.FC<SearchModuleProps> = ({ searchTerm, setSearchTerm }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
      <div className={styles.searchContainer}>
        {/* Icono de búsqueda */}
        {!isSearchOpen && (
            <FaSearch className={styles.searchIcon} onClick={() => setIsSearchOpen(true)} />
        )}

        {/* Popup de búsqueda */}
        {isSearchOpen && (
            <div className={styles.searchPopup}>
              <button className={styles.closeButton} onClick={() => setIsSearchOpen(false)}>
                <FaTimes />
              </button>
              <input
                  type="text"
                  placeholder="Buscar película..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
              />
            </div>
        )}
      </div>
  );
};

export default Search
