// src/components/FontSizeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, Type } from 'lucide-react';
import { clsx } from 'clsx';

type FontSize = 'normal' | 'large' | 'extra-large';

const FONT_SIZES: FontSize[] = ['normal', 'large', 'extra-large'];

interface FontSizeToggleProps {
  /** When "inline", renders inside header (no fixed positioning). When undefined, renders as floating widget. */
  variant?: 'inline' | 'floating';
}

export function FontSizeToggle({ variant = 'floating' }: FontSizeToggleProps) {
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
    variant === 'inline'
      ? 'flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-blue-600 text-white min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation'
      : 'flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-blue-600 text-white min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:bg-blue-700 hover:shadow-[0_3px_10px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation';

  const iconSize = variant === 'inline' ? 'h-4 w-4' : 'h-5 w-5';

  const wrap = variant === 'inline' ? (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100/80 dark:bg-gray-800/80 p-0.5"
      role="group"
      aria-label="Text size"
    >
      <button
        type="button"
        onClick={zoomOut}
        disabled={fontSize === 'normal'}
        className={clsx(baseBtn, fontSize === 'normal' && 'opacity-50 cursor-not-allowed pointer-events-none')}
        aria-label="Decrease text size"
        title="Smaller text"
      >
        <Minus className={iconSize} strokeWidth={2.5} />
      </button>
      <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded text-gray-700 dark:text-gray-300" aria-hidden title="Text size">
        <Type className="h-4 w-4" strokeWidth={2} />
      </span>
      <button
        type="button"
        onClick={zoomIn}
        disabled={fontSize === 'extra-large'}
        className={clsx(baseBtn, fontSize === 'extra-large' && 'opacity-50 cursor-not-allowed pointer-events-none')}
        aria-label="Increase text size"
        title="Larger text"
      >
        <Plus className={iconSize} strokeWidth={2.5} />
      </button>
    </div>
  ) : (
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
        <Minus className={iconSize} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={zoomIn}
        disabled={fontSize === 'extra-large'}
        className={clsx(baseBtn, fontSize === 'extra-large' && 'opacity-50 cursor-not-allowed pointer-events-none')}
        aria-label="Increase text size (Zoom in)"
        title="Zoom in"
      >
        <Plus className={iconSize} strokeWidth={2.5} />
      </button>
    </div>
  );

  return wrap;
}

