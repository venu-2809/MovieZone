// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\pages\HomePage.js
import React from 'react';
import './HomePage.css';
import MovieList from '../components/MovieList';
import ExclusiveContent from '../components/ExclusiveContent';

const HomePage = () => {
  const movies = [
    { id: 1, title: 'Movie 1', price: 10 },
    { id: 2, title: 'Movie 2', price: 15 },
  ]; // Replace with API data

  const exclusiveContent = [
    { id: 1, title: 'BTS Clip 1', description: 'Behind the scenes of Movie 1', url: '#' },
    { id: 2, title: 'Premiere Event', description: 'Live event with cast', url: '#' },
  ]; // Replace with API data

  return (
    <div>
      <h1>Welcome to CinemaOne</h1>
      <MovieList movies={movies} />
      <ExclusiveContent content={exclusiveContent} />
    </div>
  );
};

export default HomePage;