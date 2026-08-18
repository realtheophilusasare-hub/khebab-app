import { useEffect, useState } from 'react';
import '../styles/ThemeToggle.css';

interface Props {
  onToggle: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
}

export function ThemeToggle({ onToggle, theme }: Props) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      className={`theme-toggle ${theme} ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {theme === 'dark' ? (
            <svg className="toggle-icon moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
          ) : (
            <svg className="toggle-icon sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
