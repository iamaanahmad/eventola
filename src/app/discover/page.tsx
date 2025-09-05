import { Metadata } from 'next';
import { DiscoverPage } from '@/components/discover-page';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Discover Events - Eventola',
  description: 'Find amazing events happening around you. Browse public events, filter by date, location, and theme.',
};

export default function Discover() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <DiscoverPage />
      </main>
      <Footer />
    </>
  );
}
