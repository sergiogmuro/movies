import {useEffect, useState} from "react";
import {Movie} from "../../types/Movie";

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

const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

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
