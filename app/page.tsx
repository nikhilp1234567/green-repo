import { Suspense } from 'react';
import HeaderSkeleton from './components/HeaderSkeleton';
import ClientPage from './components/ClientPage';

export default function Home() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <ClientPage />
    </Suspense>
  );
}