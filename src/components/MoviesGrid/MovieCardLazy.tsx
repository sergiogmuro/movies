import React from "react";
import useLazyLoad from "../../hooks/useLazyLoad";
import MovieCard from "./MovieCard";
import {Movie} from "../../../types/Movie";

const MovieCardLazy: React.FC<{ movie: Movie; index: number }> = ({movie, index}) => {
  const {ref, isVisible} = useLazyLoad();

  return (
      <div ref={ref}>
        {isVisible ? <MovieCard movie={movie} index={index}/> : ''}
      </div>
  );
};
export default MovieCardLazy;