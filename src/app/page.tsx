'use client';

import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/SplashScreen';

export default function Home() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/evaluate');
  };

  return <SplashScreen onContinue={handleContinue} />;
}
