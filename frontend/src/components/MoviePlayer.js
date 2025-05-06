// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\components\MoviePlayer.js
import React, { useEffect } from 'react';

const MoviePlayer = ({ movieUrl }) => {
  useEffect(() => {
    // Example: Prevent right-click to block screenshots
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div>
      <h2>Now Streaming</h2>
      <video
        src={movieUrl}
        controls
        autoPlay
        style={{ width: '100%', maxHeight: '500px' }}
      ></video>
      <p>Note: This movie can only be streamed once on your registered device.</p>
    </div>
  );
};

export default MoviePlayer;