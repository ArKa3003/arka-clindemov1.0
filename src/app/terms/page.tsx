'use client';

import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Use of the ARKA Imaging Intelligence Engine (AIIE) is subject to your organization&apos;s
          agreement with ARKA Health Technologies. AIIE is provided for healthcare professional use
          only and does not constitute medical advice. For full terms, contact your administrator
          or ARKA support.
        </p>
      </main>
      <AppFooter />
    </div>
  );
}
