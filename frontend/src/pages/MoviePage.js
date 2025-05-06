// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\pages\MoviePage.js
import React from 'react';
import MoviePlayer from '../components/MoviePlayer';

const MoviePage = () => {
  const movieUrl = 'https://example.com/movie.mp4'; // Replace with actual movie URL

  return (
    <div>
      <h1>Movie Details</h1>
      <MoviePlayer movieUrl={movieUrl} />
    </div>
  );
};

export default MoviePage;