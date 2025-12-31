// src/components/AppropriatenessIndicator.tsx
'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

interface AppropriatenessIndicatorProps {
  trafficLight: 'green' | 'yellow' | 'red';
  score: number;
}

export function AppropriatenessIndicator({
  trafficLight,
  score,
}: AppropriatenessIndicatorProps) {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Check for high contrast mode preference
    const checkHighContrast = () => {
      const saved = localStorage.getItem('highContrastMode');
      const isHighContrast = saved === 'true' || document.documentElement.classList.contains('high-contrast');
      setHighContrast(isHighContrast);
    };
    
    checkHighContrast();
    
    // Listen for changes
    const observer = new MutationObserver(checkHighContrast);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    const handleStorageChange = () => checkHighContrast();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const config = {
    green: {
      label: 'APPROPRIATE',
      // Colorblind-safe: Use teal/cyan instead of pure green
      bgColor: highContrast ? 'bg-cyan-600' : 'bg-teal-500',
      borderColor: highContrast ? 'border-cyan-800' : 'border-teal-700',
      shadowColor: highContrast ? 'shadow-cyan-600/70' : 'shadow-teal-500/50',
      icon: '✓',
      textColor: 'text-white',
      shape: 'circle', // Circle for appropriate
      ariaLabel: 'Appropriate - Circle shape with checkmark icon',
    },
    yellow: {
      label: 'MAY BE APPROPRIATE',
      bgColor: highContrast ? 'bg-amber-500' : 'bg-yellow-400',
      borderColor: highContrast ? 'border-amber-700' : 'border-yellow-600',
      shadowColor: highContrast ? 'shadow-amber-500/70' : 'shadow-yellow-400/50',
      icon: '?',
      textColor: 'text-gray-900',
      shape: 'triangle', // Triangle for may be appropriate
      ariaLabel: 'May be appropriate - Triangle shape with question mark icon',
    },
    red: {
      label: 'NOT APPROPRIATE',
      // Colorblind-safe: Use darker red with pattern
      bgColor: highContrast ? 'bg-red-700' : 'bg-red-600',
      borderColor: highContrast ? 'border-red-900' : 'border-red-800',
      shadowColor: highContrast ? 'shadow-red-700/70' : 'shadow-red-600/50',
      icon: '✗',
      textColor: 'text-white',
      shape: 'octagon', // Octagon (stop sign) for not appropriate
      ariaLabel: 'Not appropriate - Octagon shape with X icon',
    },
  };

  const currentConfig = config[trafficLight];

  // Shape-specific classes
  const shapeClasses = {
    circle: 'rounded-full',
    triangle: 'clip-triangle',
    octagon: 'clip-octagon',
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      {/* Large Traffic Light Indicator - Responsive sizing with distinct shapes */}
      <div
        className={clsx(
          'relative flex h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 items-center justify-center border-4 shadow-2xl transition-all',
          shapeClasses[currentConfig.shape as keyof typeof shapeClasses],
          currentConfig.bgColor,
          currentConfig.borderColor,
          currentConfig.shadowColor,
          trafficLight === 'red' && 'animate-pulse-red',
          trafficLight === 'yellow' && 'pattern-stripes-yellow'
        )}
        role="status"
        aria-label={currentConfig.ariaLabel}
      >
        {/* Large Central Icon - Always visible for colorblind users */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span
            className={clsx(
              'text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg',
              currentConfig.textColor
            )}
            aria-hidden="true"
          >
            {currentConfig.icon}
          </span>
        </div>

        {/* Text Label Inside - Centered, below icon */}
        <div className="absolute bottom-2 left-0 right-0 px-2 text-center z-10">
          <p
            className={clsx(
              'text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] font-extrabold uppercase leading-tight tracking-wider',
              currentConfig.textColor,
              'drop-shadow-md'
            )}
          >
            {currentConfig.label}
          </p>
        </div>

        {/* Shape indicator badge - Top right corner */}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
          <span
            className={clsx(
              'flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded border-2 font-bold text-xs sm:text-sm',
              trafficLight === 'green' && 'bg-white border-teal-700 text-teal-700',
              trafficLight === 'yellow' && 'bg-white border-amber-700 text-amber-700',
              trafficLight === 'red' && 'bg-white border-red-800 text-red-800'
            )}
            aria-label={`Shape indicator: ${currentConfig.shape}`}
            title={`Shape: ${currentConfig.shape}`}
          >
            {trafficLight === 'green' && '○'}
            {trafficLight === 'yellow' && '△'}
            {trafficLight === 'red' && '⬛'}
          </span>
        </div>
      </div>

      {/* Score Display Below */}
      {score > 0 ? (
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{score}</div>
          <div className="text-xs sm:text-sm text-gray-600">/9</div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-500">N/A</div>
          <div className="text-xs text-gray-500">Insufficient Data</div>
        </div>
      )}
    </div>
  );
}

