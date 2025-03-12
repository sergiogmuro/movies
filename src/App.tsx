import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import MoviesGrid from "./components/MoviesGrid/MoviesGrid";
import MovieDetails from "./components/MovieDetails/MovieDetails";

import './_App.css';

const APP_NAME = import.meta.env.VITE_APP_NAME || "Movies Tau One";

const App: React.FC = () => {

  useEffect(() => {
    return () => {
      document.title = APP_NAME;
    };
  }, []);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<MoviesGrid/>}/>
          <Route path="/movie/:id" element={<MovieDetails/>}/>
        </Routes>
      </Router>
  );
};

export default App;
