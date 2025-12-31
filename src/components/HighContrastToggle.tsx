// src/components/HighContrastToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

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
        'fixed bottom-4 right-20 sm:right-20 z-50',
        'flex items-center justify-center',
        'w-12 h-12 rounded-full',
        isHighContrast 
          ? 'bg-gray-800 text-white border-2 border-white' 
          : 'bg-gray-200 text-gray-800 border-2 border-gray-400',
        'shadow-lg hover:shadow-xl',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'text-lg font-bold',
        'min-h-[44px] min-w-[44px]' // Touch target size
      )}
      aria-label={isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
      title="Toggle high contrast mode for better visibility"
    >
      <span className="text-xl" aria-hidden="true">
        {isHighContrast ? '⚫' : '⚪'}
      </span>
    </button>
  );
}

