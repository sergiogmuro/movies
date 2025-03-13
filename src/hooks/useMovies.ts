import { useEffect, useState } from "react";
import { Movie } from "../../types/Movie";
import readMoviesFromCSV from "../../utils/csvReader";

export const Categories = {
  "movies": 'Peliculas',
  "series": 'Series'
}

interface SearchParams {
  id?: number;
  title?: string;
  genre?: string;
  category?: string;
  year?: number;
  limit?: number;
}

const SERVERLESS = import.meta.env.VITE_USE_SERVERLESS === "true";
const MOVIES_CSV_PATH = import.meta.env.VITE_MOVIES_CSV_PATH || "/public/movies.csv";

const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carga
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (SERVERLESS) {
      fetchMoviesLocal();
    } else {
      fetchMovies();
    }
  }, []);

  const fetchMoviesLocal = async () => {
    try {
      setLoading(true); // Activar estado de carga antes de hacer la petición
      const response = await fetch(MOVIES_CSV_PATH);
      const text = await response.text();

      const rows = text.split("\n").slice(1).filter(row => row.trim() !== "");
      const movies = rows.map((row, index) => {
        const regex = /"(.*?)"|\s*([^",]+)\s*/g;
        const columns = [];
        let match;

        while ((match = regex.exec(row)) !== null) {
          columns.push(match[1] || match[2]);
        }

        return {
          id: index,
          name: columns[0] ?? "",
          categoryName: columns[1] ?? "",
          year: columns[2] ?? "",
          file: columns[3] ?? "",
          resolution: columns[4] ?? "",
          language: columns[5] ?? "",
          subtitled: columns[6] === "true",
          url: columns[7] ?? "",
          image: columns[8] || "https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg",
          adult: columns[9] ?? "",
          genre: columns[10] ?? "",
          overview: columns[11] ?? "",
          originalTitle: columns[12] ?? "",
          originalLanguage: columns[13] ?? "",
          releaseDate: columns[14] ?? "",
          popularity: columns[15] ?? "",
        };
      });

      setMovies(movies);
      setLoading(false); // Desactivar estado de carga una vez que los datos estén listos
    } catch (err) {
      setError("Error al cargar las películas");
      setLoading(false); // Asegurarse de desactivar el estado de carga en caso de error
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true); // Activar estado de carga antes de hacer la petición
      const response = await fetch("/movies");
      const data = await response.json();

      setMovies(data);
      setLoading(false); // Desactivar estado de carga una vez que los datos estén listos
    } catch (err) {
      setError("Error al cargar las películas");
      setLoading(false); // Asegurarse de desactivar el estado de carga en caso de error
    }
  };

  const getMovies = (limit?: number) => {
    return limit ? movies.slice(0, limit) : movies;
  };

  const findMovies = (params: SearchParams, limit?: number, strict: boolean = false) => {
    let list = movies.filter((movie) => {
      const matchId = params.id ? movie.id === params.id : true;

      let matchTitle = params.title?.length
          ? movie.name.toLowerCase().includes(params.title.toLowerCase())
          : true;
      let matchGenre = params.genre?.length
          ? movie.genre.toLowerCase().includes(params.genre.toLowerCase())
          : true;
      let matchCategory = params.category?.length
          ? movie.categoryName.toLowerCase().includes(params.category.toLowerCase())
          : true;
      let matchYear = params.year
          ? parseInt(movie.year) === params.year
          : true;

      if (strict) {
        if (params.category) {
          matchCategory = movie.categoryName.toLowerCase() == params.category.toLowerCase();
        }
        if (params.title) {
          matchTitle = movie.name.toLowerCase() == params.title.toLowerCase();
        }
      }

      return matchId && matchTitle && matchGenre && matchYear && matchCategory;
    });

    return limit ? list.slice(0, limit) : list;
  };

  const getMoviesWithParams = (params: SearchParams) => {
    return getMovies(params.limit ? params.limit : undefined);
  };

  return {
    movies,
    loading,
    getMovies,
    findMovies,
    getMoviesWithParams,
  };
};

export default useMovies;
