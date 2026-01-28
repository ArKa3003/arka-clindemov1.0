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

  // Minimum sizes: circle 120–150px, octagon 130–160px, triangle matches
  const sizeClasses = {
    circle: 'min-h-[120px] min-w-[120px] h-[130px] w-[130px] sm:h-[140px] sm:w-[140px] md:h-[150px] md:w-[150px]',
    octagon: 'min-h-[130px] min-w-[130px] h-[140px] w-[140px] sm:h-[150px] sm:w-[150px] md:h-[160px] md:w-[160px]',
    triangle: 'min-h-[120px] min-w-[120px] h-[130px] w-[130px] sm:h-[140px] sm:w-[140px] md:h-[150px] md:w-[150px]',
  };
  const shapeKey = currentConfig.shape as keyof typeof shapeClasses;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      {/* Large Traffic Light Indicator – min 120–150px circle, 130–160px octagon, 8–10px padding */}
      <div
        className={clsx(
          'relative flex flex-col items-center justify-center border-4 shadow-2xl transition-all p-[10px] box-border',
          sizeClasses[shapeKey],
          shapeClasses[shapeKey],
          currentConfig.bgColor,
          currentConfig.borderColor,
          currentConfig.shadowColor,
          trafficLight === 'red' && 'animate-pulse-red',
          trafficLight === 'yellow' && 'pattern-stripes-yellow'
        )}
        role="status"
        aria-label={currentConfig.ariaLabel}
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        {/* Central content: icon + label, flex column, centered */}
        <div className="flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 w-full px-1 py-0 z-10">
          {/* Large Central Icon – scaled to leave room for text */}
          <span
            className={clsx(
              'flex-shrink-0 text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg leading-none',
              currentConfig.textColor
            )}
            aria-hidden="true"
          >
            {currentConfig.icon}
          </span>
          {/* Text label – responsive, centered, uppercase; octagon uses two lines */}
          <div
            className={clsx(
              'flex flex-col items-center justify-center text-center min-h-0',
              currentConfig.shape === 'circle' && 'badge-label-circle',
              currentConfig.shape === 'octagon' && 'badge-label-octagon',
              currentConfig.shape === 'triangle' && 'badge-label-triangle',
              currentConfig.textColor,
              'drop-shadow-md'
            )}
          >
            {currentConfig.shape === 'octagon' ? (
              <>
                <span className="block leading-tight">NOT</span>
                <span className="block leading-tight">APPROPRIATE</span>
              </>
            ) : (
              <span className="block leading-tight">{currentConfig.label}</span>
            )}
          </div>
        </div>

        {/* Shape indicator badge - Top right, half outside shape so never covered */}
        <div
          className="absolute z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center"
          style={{ top: 0, right: 0, transform: 'translate(40%, -40%)' }}
        >
          <span
            className={clsx(
              'flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold text-xs sm:text-sm shadow-md',
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

      {/* Score Display Below – 18–24px, clearly visible */}
      {score > 0 ? (
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>
            {score} <span className="text-gray-800 font-semibold">/9</span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-lg sm:text-xl font-bold text-gray-500" style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>
            N/A
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Insufficient Data</div>
        </div>
      )}
    </div>
  );
}

