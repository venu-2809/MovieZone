// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\components\MoviePlayer.js
import React, { useEffect, useRef, useState } from 'react';

// Helper: format time
const formatTime = (time) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const MoviePlayer = ({ movieUrl }) => {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 2500);
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Prevent right-click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Fullscreen handlers
  const handleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Play/Pause handlers
  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Time update
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    // Update buffered
    const buf = videoRef.current.buffered;
    if (buf.length) {
      setBuffered(buf.end(buf.length - 1));
    }
  };

  // Duration loaded
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // Seek
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Seek bar drag
  const handleSeekMouseDown = () => setIsSeeking(true);
  const handleSeekMouseUp = (e) => {
    setIsSeeking(false);
    handleSeek(e);
  };

  // Volume
  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    videoRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const handleMute = () => {
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.5;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;
      switch (e.code) {
        case 'Space':
        case 'KeyK':
          handlePlayPause();
          e.preventDefault();
          break;
        case 'ArrowRight':
          videoRef.current.currentTime = Math.min(
            videoRef.current.currentTime + 10,
            duration
          );
          break;
        case 'ArrowLeft':
          videoRef.current.currentTime = Math.max(
            videoRef.current.currentTime - 10,
            0
          );
          break;
        case 'KeyF':
          handleFullscreen();
          break;
        case 'KeyM':
          handleMute();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [duration, isMuted, volume]);

  // Volume sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Seekbar hover time
  const handleSeekbarMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverTime(Math.max(0, Math.min(duration, percent * duration)));
  };
  const handleSeekbarMouseLeave = () => setHoverTime(null);

  // Responsive: adjust video height on small screens
  const getVideoHeight = () => {
    if (window.innerWidth < 600) return 220;
    if (window.innerWidth < 900) return 320;
    return 450;
  };

  // Animations for controls
  const controlsStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: showControls
      ? 'linear-gradient(0deg, rgba(0,0,0,0.8) 90%, rgba(0,0,0,0.0) 100%)'
      : 'transparent',
    opacity: showControls ? 1 : 0,
    transition: 'opacity 0.35s cubic-bezier(.4,0,.2,1)',
    pointerEvents: showControls ? 'auto' : 'none',
    padding: showControls ? '18px 28px 14px 28px' : '0',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    zIndex: 2,
  };

  // Progress bar with buffer
  const progressBarContainer = {
    position: 'relative',
    width: '100%',
    height: 8,
    marginBottom: 2,
    cursor: 'pointer',
  };
  const bufferBar = {
    position: 'absolute',
    height: 8,
    background: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    left: 0,
    top: 0,
    width: duration ? `${(buffered / duration) * 100}%` : '0%',
    zIndex: 1,
    pointerEvents: 'none',
  };
  const seekBar = {
    position: 'absolute',
    height: 8,
    background: 'linear-gradient(90deg, #e50914 0%, #f40612 100%)',
    borderRadius: 4,
    left: 0,
    top: 0,
    width: duration ? `${(currentTime / duration) * 100}%` : '0%',
    zIndex: 2,
    pointerEvents: 'none',
  };

  // Seekbar thumb
  const thumbStyle = {
    position: 'absolute',
    left: duration ? `calc(${(currentTime / duration) * 100}% - 8px)` : '-8px',
    top: -4,
    width: 16,
    height: 16,
    background: '#fff',
    border: '2px solid #e50914',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(229,9,20,0.15)',
    zIndex: 3,
    pointerEvents: 'none',
    transition: 'background 0.2s',
  };

  // Seekbar hover preview
  const hoverPreviewStyle = hoverTime !== null
    ? {
        position: 'absolute',
        left: duration ? `calc(${(hoverTime / duration) * 100}% - 24px)` : '-24px',
        bottom: 18,
        background: '#222',
        color: '#fff',
        fontSize: 12,
        padding: '2px 8px',
        borderRadius: 6,
        pointerEvents: 'none',
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
      }
    : { display: 'none' };

  // Main render
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #181818 60%, #232526 100%)',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        padding: 0,
        maxWidth: 860,
        margin: '48px auto',
        color: '#fff',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <h2
        style={{
          fontWeight: 800,
          fontSize: 30,
          margin: '0 0 18px 0',
          letterSpacing: 1,
          padding: '32px 40px 0 40px',
          textShadow: '0 2px 8px rgba(0,0,0,0.22)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span role="img" aria-label="movie" style={{ fontSize: 32 }}>🎬</span>
        Now Streaming
      </h2>
      <div
        style={{
          position: 'relative',
          background: '#000',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 4px 18px rgba(0,0,0,0.32)',
          margin: '0 40px',
        }}
      >
        <video
          ref={videoRef}
          src={movieUrl}
          controls={false}
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          style={{
            width: '100%',
            maxHeight: getVideoHeight(),
            background: '#000',
            display: 'block',
            objectFit: 'cover',
            borderRadius: 0,
            transition: 'max-height 0.3s',
          }}
          poster="/placeholder-movie.jpg"
        />
        {/* Custom Controls */}
        <div
          ref={controlsRef}
          style={controlsStyle}
          onMouseMove={() => setShowControls(true)}
        >
          {/* Progress Bar with Buffer and Seek */}
          <div
            style={progressBarContainer}
            onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              const time = percent * duration;
              videoRef.current.currentTime = time;
              setCurrentTime(time);
            }}
            onMouseMove={handleSeekbarMouseMove}
            onMouseLeave={handleSeekbarMouseLeave}
          >
            <div style={bufferBar} />
            <div style={seekBar} />
            <div style={thumbStyle} />
            {hoverTime !== null && (
              <div style={hoverPreviewStyle}>{formatTime(hoverTime)}</div>
            )}
            {/* Hidden range input for accessibility */}
            <input
              type="range"
              min={0}
              max={duration}
              value={isSeeking ? undefined : currentTime}
              step="any"
              onChange={handleSeek}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: 8,
                opacity: 0,
                zIndex: 5,
                cursor: 'pointer',
              }}
              aria-label="Seek"
            />
          </div>
          {/* Controls Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              style={{
                background: isPlaying
                  ? 'rgba(229,9,20,0.85)'
                  : 'rgba(255,255,255,0.12)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                color: '#fff',
                fontSize: 22,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlaying
                  ? '0 2px 8px rgba(229,9,20,0.18)'
                  : '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="4" y="3" width="5" height="16" rx="2" fill="white"/>
                  <rect x="13" y="3" width="5" height="16" rx="2" fill="white"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <polygon points="5,3 19,11 5,19" fill="white"/>
                </svg>
              )}
            </button>
            {/* Time */}
            <span
              style={{
                fontVariantNumeric: 'tabular-nums',
                fontSize: 15,
                color: '#fff',
                minWidth: 90,
                textAlign: 'center',
                letterSpacing: 0.5,
                userSelect: 'none',
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleMute}
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 18,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 8v4h4l5 5V3l-5 5H3z" fill="#fff" opacity="0.5"/>
                    <line x1="15" y1="7" x2="19" y2="13" stroke="#fff" strokeWidth="2"/>
                    <line x1="19" y1="7" x2="15" y2="13" stroke="#fff" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 8v4h4l5 5V3l-5 5H3z" fill="#fff"/>
                    <path d="M15 9a3 3 0 010 2" stroke="#fff" strokeWidth="2"/>
                    <path d="M17 7a7 7 0 010 6" stroke="#fff" strokeWidth="2"/>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  width: 70,
                  accentColor: '#e50914',
                  cursor: 'pointer',
                  height: 4,
                }}
                aria-label="Volume"
              />
            </div>
            {/* Spacer */}
            <div style={{ flex: 1 }} />
            {/* Picture-in-Picture */}
            {'pictureInPictureEnabled' in document && (
              <button
                onClick={() => {
                  if (videoRef.current !== document.pictureInPictureElement) {
                    videoRef.current.requestPictureInPicture();
                  } else {
                    document.exitPictureInPicture();
                  }
                }}
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 18,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  marginRight: 8,
                  transition: 'background 0.2s',
                }}
                aria-label="Picture in Picture"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" fill="#fff" opacity="0.3"/>
                  <rect x="11" y="11" width="5" height="4" rx="1" fill="#fff"/>
                </svg>
              </button>
            )}
            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 18,
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M7 15v2H3v-4h2v2h2zm8-8V5h4v4h-2V7h-2zm-8 0V5H3v4h2V7h2zm8 8v2h4v-4h-2v2h-2z" fill="#fff"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 3h6v2H5v4H3V3zm16 0v6h-2V5h-4V3h6zm0 16h-6v-2h4v-4h2v6zm-16 0v-6h2v4h4v2H3z" fill="#fff"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Overlay: Play Button when paused */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
              background: 'rgba(229,9,20,0.92)',
              border: 'none',
              borderRadius: '50%',
              width: 80,
              height: 80,
              color: '#fff',
              fontSize: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 24px rgba(229,9,20,0.22)',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background 0.2s',
              outline: 'none',
            }}
            aria-label="Play"
          >
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <polygon points="10,7 32,19 10,31" fill="white"/>
            </svg>
          </button>
        )}
        {/* Overlay: Top gradient for polish */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            height: 60,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.0) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </div>
      {/* Info Bar */}
      <div
        style={{
          margin: '28px 40px 0 40px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '16px 22px',
          fontSize: 17,
          color: '#e50914',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(229,9,20,0.08)',
        }}
      >
        <span role="img" aria-label="info" style={{ fontSize: 22 }}>🔒</span>
        This movie can only be streamed once on your registered device.
      </div>
      {/* Keyboard Shortcuts Helper */}
      <div
        style={{
          margin: '18px 40px 32px 40px',
          color: '#bbb',
          fontSize: 13,
          textAlign: 'right',
          opacity: 0.85,
          userSelect: 'none',
        }}
      >
        <span style={{ marginRight: 18 }}>
          <b>Space</b>/<b>K</b>: Play/Pause
        </span>
        <span style={{ marginRight: 18 }}>
          <b>←</b>/<b>→</b>: Seek
        </span>
        <span style={{ marginRight: 18 }}>
          <b>M</b>: Mute
        </span>
        <span>
          <b>F</b>: Fullscreen
        </span>
      </div>
    </div>
  );
};

export default MoviePlayer;