'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sun, Moon, Menu, X, Plus } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { FontSizeToggle } from '@/components/FontSizeToggle';

interface AppHeaderProps {
  /** Show "New Evaluation" button (e.g. on results view). Routes to /evaluate and clears result. */
  showNewEvaluation?: boolean;
  onNewEvaluation?: () => void;
  /** Optional: show "How It Works" as button that opens modal instead of linking to page */
  onHowItWorksClick?: () => void;
  /** Use link to /how-it-works when false (default) */
  useHowItWorksModal?: boolean;
}

const HEADER_HEIGHT_CLASS = 'h-14'; // ~56px for scroll-margin / padding
const TOUCH_TARGET = 'min-h-[44px] min-w-[44px]'; // WCAG 2.5.5 touch target minimum

export function AppHeader({
  showNewEvaluation = false,
  onNewEvaluation,
  onHowItWorksClick,
  useHowItWorksModal = false,
}: AppHeaderProps) {
  const pathname = usePathname();
  const isSplash = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    setIsDark(!!stored);
  }, []);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle('dark');
    setIsDark(document.documentElement.classList.contains('dark'));
    try {
      localStorage.setItem('arka-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('arka-theme') : null;
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (stored === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={`${HEADER_HEIGHT_CLASS} sticky top-0 z-50 flex shrink-0 items-center border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900`}
      role="banner"
      style={{ minHeight: '3.5rem' }}
    >
      <div className="flex h-full w-full max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 mx-auto">
        {/* Left: Logo, Home (when not splash), Title/CDS — on md+ also visible nav */}
        <div className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
          {/* ARKA Logo — touch target 44px */}
          <Link
            href="/"
            className={`flex items-center justify-center rounded-lg transition-opacity hover:opacity-90 ${TOUCH_TARGET} p-2 sm:p-0 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0`}
            aria-label="ARKA home"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600">
              <span className="text-xs font-bold text-white">ARKA</span>
            </div>
          </Link>
          {/* Home icon — touch target 44px on mobile */}
          {!isSplash && (
            <Link
              href="/"
              className={`flex items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 ${TOUCH_TARGET} p-2 sm:p-0 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0`}
              aria-label="Return to ARKA home (splash)"
              title="Home"
            >
              <Home className="h-5 w-5" />
            </Link>
          )}
          <div className="hidden min-w-0 sm:block">
            <div className="truncate font-semibold text-gray-900 dark:text-white" title="ARKA Imaging Intelligence Engine">
              ARKA Imaging Intelligence Engine
            </div>
          </div>
          <span
            className="hidden shrink-0 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 dark:border-teal-600 dark:bg-teal-900/40 dark:text-teal-300 md:inline-flex"
            title="Non-Device Clinical Decision Support"
          >
            Non-Device CDS
          </span>
        </div>

        {/* Spacer */}
        <div className="min-w-0 flex-1" aria-hidden="true" />

        {/* Desktop (md+): Nav + Theme + Avatar */}
        <div className="hidden md:flex shrink-0 items-center gap-4 lg:gap-6">
          <nav className="flex items-center gap-4 lg:gap-6" aria-label="Main navigation">
            {useHowItWorksModal && onHowItWorksClick ? (
              <button
                type="button"
                onClick={onHowItWorksClick}
                className={`text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ${TOUCH_TARGET} flex items-center justify-center`}
              >
                How It Works
              </button>
            ) : (
              <Link
                href="/how-it-works"
                className={`text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ${TOUCH_TARGET} flex items-center justify-center`}
              >
                How It Works
              </Link>
            )}
            {showNewEvaluation && onNewEvaluation && (
              <button
                type="button"
                onClick={onNewEvaluation}
                className={`text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ${TOUCH_TARGET} flex items-center justify-center gap-1.5 transition-colors duration-150`}
                aria-label="Start a new evaluation"
              >
                <Plus className="h-4 w-4 shrink-0" aria-hidden />
                New Evaluation
              </button>
            )}
          </nav>
          <div className="flex shrink-0 items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-600 pr-1">
            <FontSizeToggle variant="inline" />
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 ${TOUCH_TARGET}`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile (<768px): Hamburger + Text size + ensure right padding so controls aren't clipped */}
        <div className="flex md:hidden shrink-0 items-center gap-1 pr-2 min-w-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 ${TOUCH_TARGET} p-2`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <FontSizeToggle variant="inline" />
        </div>
      </div>

      {/* Mobile menu overlay (How It Works, New Evaluation, Settings) */}
      <div
        id="header-mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-40 md:hidden ${menuOpen ? 'visible' : 'invisible pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={closeMenu}
          aria-hidden
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white dark:bg-gray-900 shadow-xl flex flex-col pt-14 pb-6 px-4 gap-1 transition-transform duration-200 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {useHowItWorksModal && onHowItWorksClick ? (
              <button
                type="button"
                onClick={() => {
                  onHowItWorksClick();
                  closeMenu();
                }}
                className={`${TOUCH_TARGET} flex items-center px-4 rounded-lg text-left text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium`}
              >
                How It Works
              </button>
            ) : (
              <Link
                href="/how-it-works"
                onClick={closeMenu}
                className={`${TOUCH_TARGET} flex items-center px-4 rounded-lg text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium`}
              >
                How It Works
              </Link>
            )}
            {showNewEvaluation && onNewEvaluation && (
              <button
                type="button"
                onClick={() => {
                  onNewEvaluation();
                  closeMenu();
                }}
                className={`${TOUCH_TARGET} flex items-center gap-2 px-4 rounded-lg text-left text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-150`}
              >
                <Plus className="h-5 w-5 shrink-0" aria-hidden />
                New Evaluation
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                closeMenu();
              }}
              className={`${TOUCH_TARGET} flex items-center px-4 rounded-lg text-left text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium`}
            >
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export { HEADER_HEIGHT_CLASS };
