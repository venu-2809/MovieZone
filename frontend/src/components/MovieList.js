// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\components\MovieList.js
import React from 'react';
import './MovieList.css';
import { Link } from 'react-router-dom';

const MovieList = ({ movies }) => {
  return (
    <div>
      <h2>Available Movies</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <h3>{movie.title}</h3>
            <p>Price: ${movie.price}</p>
            <Link to={`/movie/${movie.id}`}>Watch Now</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;