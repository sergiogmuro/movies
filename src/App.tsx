import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import MoviesGrid from "./components/MoviesGrid/MoviesGrid";
import MovieDetails from "./components/MovieDetails/MovieDetails";

import './_App.css';  // Aquí es donde se importa el archivo global de estilos

const App: React.FC = () => {
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
