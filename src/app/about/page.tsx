
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Zap, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
          <section className="text-center animate-in fade-in-0 duration-500">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">
              About Eventola
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Turn ideas into events with shareable microsites in minutes.
            </p>
          </section>

          <section className="mt-16 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Info className="text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-muted-foreground">
                <p>
                  Our mission is to empower creators, organizers, and communities to host successful events without the hassle of complex tools. We believe that creating a beautiful and functional event page should be as fast and exciting as the event itself. Eventola was built to be intuitive, powerful, and fun.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="text-primary" />
                  Powered by Appwrite
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  Eventola is proudly built for the Appwrite Sites Hackathon and is powered entirely by the Appwrite platform. We leverage its robust backend services to deliver a seamless, real-time experience:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Appwrite Authentication:</strong> Secure login and registration for event organizers.</li>
                  <li><strong>Appwrite Databases:</strong> Storing all event and RSVP data reliably.</li>
                  <li><strong>Appwrite Storage:</strong> Handling uploads for event cover images.</li>
                  <li><strong>Appwrite Realtime:</strong> Powering the live RSVP counters that update instantly across all clients.</li>
                </ul>
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="text-primary" />
                  A Note for the Judges
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-muted-foreground">
                <p>
                  This project was designed to be a testament to the power and developer experience of Appwrite. Every core feature, from user accounts to live data synchronization, is handled by Appwrite, demonstrating its capability as an all-in-one backend solution. We hope you enjoy exploring the platform as much as we enjoyed building it! Check out our{' '}
                   <Link href="/event/demo-event" className="text-primary font-semibold hover:underline">
                      live demo event
                    </Link> to see it all in action.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
