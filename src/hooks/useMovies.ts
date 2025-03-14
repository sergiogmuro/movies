import {useEffect, useState} from "react";
import {Movie} from "../../types/Movie";
import readMoviesFromCSV from "../../utils/csvReader";
import Papa from 'papaparse';

export const Categories = {
  "movies": 'Peliculas',
  "series": 'Series'
}

interface SearchParams {
  id?: number;
  hash?: string;
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
      setLoading(true);

      const response = await fetch(MOVIES_CSV_PATH);
      const text = await response.text();

      // Usa PapaParse para manejar correctamente el CSV
      const { data } = Papa.parse(text, {
        header: false, // No hay encabezados en el archivo
        skipEmptyLines: true,
        delimiter: ",", // Separador CSV estándar
        quoteChar: '"', // Respeta valores entre comillas
      });

      const movies = data.map((columns, index) => {
        return {
          id: index,
          hash: columns[0] ?? "",
          name: columns[1] ?? "",
          categoryName: columns[2] ?? "",
          year: columns[3] ?? "",
          file: columns[4] ?? "",
          resolution: columns[5] ?? "",
          language: columns[6] ?? "",
          subtitled: columns[7] === "true",
          url: columns[8] ?? "",
          image: columns[9] || "https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg",
          adult: columns[10] ?? "",
          genre: columns[11] ?? "",
          overview: columns[12] ?? "",
          originalTitle: columns[13] ?? "",
          originalLanguage: columns[14] ?? "",
          releaseDate: columns[15] ?? "",
          popularity: columns[16] ?? "",
          certificationAvg: columns[17] ?? "",
          certificationCategory: columns[18] ?? "",
          publishDate: columns[19] ?? "",
        };
      });

      movies.sort((a, b) => parseFloat(b.year + b.popularity) - parseFloat(a.year + a.popularity));

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

  const findMovies = (params: SearchParams, limit?: number, strict: boolean = false, orderByDesc: keyof Movie = 'year') => {
    movies.sort((a, b) =>
        (parseFloat(`${b[orderByDesc]}`) || 0) - (parseFloat(`${a[orderByDesc]}`) || 0) ||
        parseFloat(b.popularity) - parseFloat(a.popularity)
    );

    let list = movies.filter((movie) => {
      const matchId = params.id ? movie.id === params.id : true;
      const matchHash = params.hash ? movie.hash === params.hash : true;

      let matchTitle = params.title?.length
          ? movie.name.toLowerCase().includes(params.title.toLowerCase()) || movie.originalTitle.toLowerCase().includes(params.title.toLowerCase())
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

      return matchHash && matchId && matchTitle && matchGenre && matchYear && matchCategory;
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
