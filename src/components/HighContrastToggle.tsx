// src/components/HighContrastToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Sun, Moon } from 'lucide-react';

export function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem('highContrastMode');
    if (saved === 'true') {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
    
    // Listen for changes from other components
    const handleStorageChange = () => {
      const current = localStorage.getItem('highContrastMode');
      const newState = current === 'true';
      setIsHighContrast(newState);
      if (newState) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleHighContrast = () => {
    const newState = !isHighContrast;
    setIsHighContrast(newState);
    
    if (newState) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrastMode', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrastMode', 'false');
    }
  };

  return (
    <button
      onClick={toggleHighContrast}
      className={clsx(
        'fixed top-3 right-3 sm:top-4 sm:right-4 z-40',
        'flex items-center justify-center',
        'w-12 h-12 sm:w-14 sm:h-14 rounded-full',
        isHighContrast 
          ? 'bg-gray-800 text-white border-2 border-white' 
          : 'bg-gray-200 text-gray-800 border-2 border-gray-400',
        'shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
        'hover:scale-105 active:scale-95',
        'transition-all duration-300 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'text-lg font-bold',
        'min-h-[44px] min-w-[44px]' // Touch target size
      )}
      aria-label={isHighContrast ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isHighContrast ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isHighContrast ? (
        <Sun className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      )}
    </button>
  );
}

