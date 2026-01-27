'use client';

import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

export function FloatingFeedbackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;
  if (pathname === '/feedback') return null;

  return (
    <button
      onClick={() => router.push('/feedback')}
      className="fixed z-40 flex min-h-[44px] min-w-[44px] sm:min-h-[56px] sm:min-w-[56px] w-14 h-14 sm:w-16 sm:h-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 hover:shadow-[0_4px_14px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-95"
      style={{ bottom: '24px', right: '24px' }}
      aria-label="Provide feedback about ARKA"
      title="Provide feedback"
    >
      <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      <span className="sr-only">Feedback</span>
    </button>
  );
}
