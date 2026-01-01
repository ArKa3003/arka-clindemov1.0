'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

export function FloatingFeedbackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/feedback')}
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-blue-700 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] sm:min-h-[56px] sm:min-w-[56px]"
      aria-label="Provide feedback about ARKA"
      title="Provide feedback"
    >
      <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      <span className="sr-only">Feedback</span>
    </button>
  );
}

