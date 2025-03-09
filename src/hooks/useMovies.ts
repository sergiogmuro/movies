import {useEffect, useState} from "react";
import {Movie} from "../../types/Movie";
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

const SERVERLESS = true;

const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      let text ='No movies found'
      try {
        const response = await fetch("/public/movies.csv");
        text = await response.text();
      } catch (e) {
        try {
          const response = await fetch("/public/movies.csv");
          text = await response.text();
        } catch (e) {
        }
      }

      const rows = text.split("\n").slice(1).filter(row => row.trim() !== "");
      const movies = rows.map((row, index) => {
        const columns = row.split(",");
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
    } catch (err) {
      setError("Error al cargar las películas");
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await fetch("/movies");
      const data = await response.json();

      setMovies(data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar las películas");
      setLoading(false);
    }
  };

  const getMovies = (limit?: number) => {
    return limit ? movies.slice(0, limit) : movies;
  };

  const findMovies = (params: SearchParams, limit?: number) => {
    let list = movies.filter((movie) => {
      const matchId = params.id ? movie.id === params.id : true;

      const matchTitle = params.title
          ? movie.title.toLowerCase().includes(params.title.toLowerCase())
          : true;
      const matchGenre = params.genre
          ? movie.genre.toLowerCase().includes(params.genre.toLowerCase())
          : true;
      const matchCategory = params.category
          ? movie.categoryName.toLowerCase().includes(params.category.toLowerCase())
          : true;
      const matchYear = params.year
          ? parseInt(movie.year) === params.year
          : true;

      return matchId && matchTitle && matchGenre && matchYear && matchCategory;
    });

    return limit ? list.slice(0, limit) : list;
  };

  const getMoviesWithParams = (params: SearchParams) => {
    return getMovies(params.limit ? params.limit : undefined);
  };

  return {
    movies,
    getMovies,
    findMovies,
    getMoviesWithParams,
  };
};

export default useMovies;
