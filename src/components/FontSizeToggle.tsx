// src/components/FontSizeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { clsx } from 'clsx';

type FontSize = 'normal' | 'large' | 'extra-large';

const FONT_SIZES: FontSize[] = ['normal', 'large', 'extra-large'];

export function FontSizeToggle() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  useEffect(() => {
    const saved = localStorage.getItem('fontSize') as FontSize | null;
    if (saved && FONT_SIZES.includes(saved)) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-extra-large');
    root.classList.add(`font-size-${size}`);
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-extra-large');
    document.body.classList.add(`font-size-${size}`);
    document.documentElement.style.fontSize = size === 'normal' ? '16px' : size === 'large' ? '18px' : '20px';
  };

  const zoomOut = () => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (idx <= 0) return;
    const next: FontSize = FONT_SIZES[idx - 1];
    setFontSize(next);
    applyFontSize(next);
    localStorage.setItem('fontSize', next);
  };

  const zoomIn = () => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (idx < 0 || idx >= FONT_SIZES.length - 1) return;
    const next: FontSize = FONT_SIZES[idx + 1];
    setFontSize(next);
    applyFontSize(next);
    localStorage.setItem('fontSize', next);
  };

  const baseBtn =
    'flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-blue-600 text-white min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:bg-blue-700 hover:shadow-[0_3px_10px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation';

  return (
    <div
      className={clsx(
        'fixed top-[72px] right-3 sm:top-[88px] sm:right-4 z-40 flex items-center gap-1.5 rounded-xl bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-600 p-1.5 shadow-md'
      )}
      role="group"
      aria-label="Text size (zoom) controls"
    >
      <button
        type="button"
        onClick={zoomOut}
        disabled={fontSize === 'normal'}
        className={clsx(baseBtn, fontSize === 'normal' && 'opacity-50 cursor-not-allowed pointer-events-none')}
        aria-label="Decrease text size (Zoom out)"
        title="Zoom out"
      >
        <Minus className="h-5 w-5" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={zoomIn}
        disabled={fontSize === 'extra-large'}
        className={clsx(baseBtn, fontSize === 'extra-large' && 'opacity-50 cursor-not-allowed pointer-events-none')}
        aria-label="Increase text size (Zoom in)"
        title="Zoom in"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

