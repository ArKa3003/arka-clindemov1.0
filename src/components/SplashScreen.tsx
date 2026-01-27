'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.title = 'Welcome | ARKA';
    setIsVisible(true);

    // Handle keyboard events
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onContinue();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onContinue]);

  const handleClick = () => {
    onContinue();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D1929] cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Welcome - Click anywhere or press Enter to continue"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onContinue();
        }
      }}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 500ms ease-in-out',
      }}
    >
      {/* Glow effect behind logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(91, 155, 213, 0.4) 0%, rgba(13, 25, 41, 0) 70%)',
          }}
        />
      </div>

      {/* Logo with floating animation */}
      <div className="relative z-10 flex items-center justify-center splash-float px-4 py-8 sm:py-12">
        <img
          src="/arka-logo.svg"
          alt="ARKA Logo"
          className="w-[400px] h-[450px] sm:w-[500px] sm:h-[562px] md:w-[600px] md:h-[675px] object-contain max-w-[90vw] max-h-[70vh]"
          width="600"
          height="675"
        />
      </div>

      {/* Continue text with pulse animation */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 z-10 splash-pulse">
        <p className="text-white/80 text-sm sm:text-base font-medium text-center px-4">
          Click anywhere or press Enter to continue
        </p>
      </div>
    </div>
  );
}

