'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

export function FloatingFeedbackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/feedback')}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[56px] min-w-[56px] sm:min-h-[64px] sm:min-w-[64px]"
      aria-label="Provide feedback about ARKA"
      title="Provide feedback"
    >
      <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      <span className="sr-only">Feedback</span>
    </button>
  );
}

