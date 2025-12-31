// src/components/FontSizeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

type FontSize = 'normal' | 'large' | 'extra-large';

export function FontSizeToggle() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem('fontSize') as FontSize | null;
    if (saved && ['normal', 'large', 'extra-large'].includes(saved)) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-extra-large');
    root.classList.add(`font-size-${size}`);
    
    // Also apply to body for consistency
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-extra-large');
    document.body.classList.add(`font-size-${size}`);
    
    // Apply to html element as well for better coverage
    document.documentElement.style.fontSize = size === 'normal' ? '16px' : size === 'large' ? '18px' : '20px';
  };

  const cycleFontSize = () => {
    const sizes: FontSize[] = ['normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    
    setFontSize(nextSize);
    applyFontSize(nextSize);
    localStorage.setItem('fontSize', nextSize);
  };

  const getLabel = () => {
    switch (fontSize) {
      case 'normal':
        return 'A';
      case 'large':
        return 'A+';
      case 'extra-large':
        return 'A++';
      default:
        return 'A';
    }
  };

  return (
    <button
      onClick={cycleFontSize}
      className={clsx(
        'fixed bottom-4 right-4 z-50',
        'flex items-center justify-center',
        'w-12 h-12 rounded-full',
        'bg-blue-600 text-white',
        'shadow-lg hover:shadow-xl',
        'hover:bg-blue-700',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'text-lg font-bold',
        'min-h-[44px] min-w-[44px]' // Touch target size
      )}
      aria-label={`Font size: ${fontSize}. Click to increase font size.`}
      title="Toggle font size (A / A+ / A++)"
    >
      {getLabel()}
    </button>
  );
}

