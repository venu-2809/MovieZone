import React, { useEffect, useState } from 'react';

// Animations and styles
const overlayStyle = {
  position: 'fixed',
  bottom: 32,
  right: 32,
  background: 'linear-gradient(135deg, #23243a 60%, #1e1e2f 100%)',
  color: '#fff',
  padding: '24px 32px',
  borderRadius: 18,
  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
  zIndex: 9999,
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 17,
  minWidth: 260,
  pointerEvents: 'auto',
  transition: 'transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s',
  opacity: 1,
  transform: 'translateY(0)',
  border: '1.5px solid #2e335a',
  backdropFilter: 'blur(8px)',
};

const hiddenStyle = {
  ...overlayStyle,
  opacity: 0,
  pointerEvents: 'none',
  transform: 'translateY(40px)',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 14,
  right: 16,
  background: 'none',
  border: 'none',
  color: '#90caf9',
  fontSize: 22,
  cursor: 'pointer',
  opacity: 0.7,
  transition: 'opacity 0.2s',
};

const badgeStyle = {
  display: 'inline-block',
  minWidth: 32,
  padding: '2px 10px',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 15,
  marginLeft: 10,
  background: 'rgba(144,202,249,0.13)',
  color: '#90caf9',
  letterSpacing: 0.2,
};

const metricNameStyle = {
  color: '#90caf9',
  fontWeight: 500,
  fontSize: 16,
};

const listStyle = {
  margin: '16px 0 0 0',
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const progressBarContainer = {
  background: '#23243a',
  borderRadius: 6,
  height: 7,
  marginTop: 6,
  marginBottom: 2,
  overflow: 'hidden',
};

function getProgressBarColor(value, name) {
  if (name === 'LCP') return value < 2500 ? '#66bb6a' : value < 4000 ? '#ffa726' : '#ef5350';
  if (name === 'FID') return value < 100 ? '#66bb6a' : value < 300 ? '#ffa726' : '#ef5350';
  if (name === 'CLS') return value < 0.1 ? '#66bb6a' : value < 0.25 ? '#ffa726' : '#ef5350';
  if (name === 'FCP') return value < 1800 ? '#66bb6a' : value < 3000 ? '#ffa726' : '#ef5350';
  if (name === 'TTFB') return value < 200 ? '#66bb6a' : value < 500 ? '#ffa726' : '#ef5350';
  return '#90caf9';
}

function getProgressBarWidth(value, name) {
  const max = {
    LCP: 4000,
    FID: 300,
    CLS: 0.25,
    FCP: 3000,
    TTFB: 500,
  }[name] || 100;
  let percent = Math.min(100, (value / max) * 100);
  if (name === 'CLS') percent = Math.min(100, (value / 0.25) * 100);
  return `${percent}%`;
}

export default function WebVitalsOverlay({ metrics }) {
  const [visible, setVisible] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (metrics && Object.keys(metrics).length > 0) {
      setVisible(true);
      setAnimatingOut(false);
      const timer = setTimeout(() => setAnimatingOut(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [metrics]);

  useEffect(() => {
    if (animatingOut) {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [animatingOut]);

  if (!visible || !metrics) return null;

  return (
    <div style={animatingOut ? hiddenStyle : overlayStyle}>
      <button
        aria-label="Close"
        style={closeBtnStyle}
        onClick={() => setAnimatingOut(true)}
        tabIndex={0}
        onMouseOver={e => (e.currentTarget.style.opacity = 1)}
        onMouseOut={e => (e.currentTarget.style.opacity = 0.7)}
      >
        ×
      </button>
      <div style={{ fontWeight: 700, fontSize: 19, letterSpacing: 0.2, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
          <circle cx="12" cy="12" r="10" fill="#90caf9" opacity="0.18"/>
          <path d="M12 7v5l3 2" stroke="#90caf9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Web Vitals
      </div>
      <ul style={listStyle}>
        {Object.entries(metrics).map(([name, value]) => (
          <li key={name}>
            <span style={metricNameStyle}>{name}</span>
            <span style={badgeStyle}>{typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}</span>
            <div style={progressBarContainer}>
              <div
                style={{
                  width: getProgressBarWidth(value, name),
                  height: '100%',
                  background: getProgressBarColor(value, name),
                  transition: 'width 0.6s cubic-bezier(.4,2,.6,1)',
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 18, fontSize: 13, color: '#b0b8d1', opacity: 0.8 }}>
        <span role="img" aria-label="info">ℹ️</span> These metrics help monitor your app’s performance.
      </div>
    </div>
  );
}
