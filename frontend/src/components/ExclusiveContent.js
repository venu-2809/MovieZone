// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\components\ExclusiveContent.js
import React from 'react';
import './ExclusiveContent.css';
const ExclusiveContent = ({ content }) => {
  return (
    <div>
      <h2>Exclusive Content</h2>
      <ul>
        {content.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Watch Now
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExclusiveContent;