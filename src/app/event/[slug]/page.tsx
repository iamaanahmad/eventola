
'use client';

import { CheckCircle, Clock, Download, MapPin, Send, Users } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { databases, storage, ID, client } from '@/lib/appwrite';
import { Models, Query, AppwriteException } from 'appwrite';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/footer';
import { Countdown } from '@/components/countdown';

// NOTE: These IDs are placeholders. You should create these in your Appwrite console.
const DATABASE_ID = 'events_db';
const EVENTS_COLLECTION_ID = 'events';
const RSVPS_COLLECTION_ID = 'rsvps';
const COVERS_BUCKET_ID = 'event-covers';
const LOGOS_BUCKET_ID = 'event-logos';


interface EventDocument extends Models.Document {
  title: string;
  description: string;
  startAt: string;
  endAt:string;
  location: string;
  coverFileId?: string;
  logoFileId?: string;
  theme: 'minimal' | 'warp' | 'quantum' | 'classic';
}

interface EventData {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  logoUrl?: string;
  startTime: Date;
  endTime: Date;
  location: string;
  rsvpCount: number;
  theme: 'minimal' | 'warp' | 'quantum' | 'classic';
}

const DEMO_EVENT_DATA: EventData = {
    id: 'demo-event',
    title: 'Quantum Futures Expo',
    description: "Join us for a journey into the future of technology. The Quantum Futures Expo is a two-day event showcasing the latest advancements in artificial intelligence, robotics, and virtual reality. Network with industry leaders, attend insightful talks, and witness groundbreaking demos that will redefine tomorrow.",
    coverUrl: 'https://picsum.photos/1200/800?random=demo',
    startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 hours after start
    location: 'Cybernetics Convention Center, Neo-Tokyo',
    rsvpCount: 1337,
    theme: 'quantum' // Default demo theme
};


function EventPageSkeleton() {
  return (
    <div>
     <Skeleton className="h-64 md:h-96 w-full" />
     <div className="container mx-auto px-4 py-8 md:py-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
             <div className="lg:col-span-2 space-y-4">
                 <Skeleton className="h-8 w-1/2" />
                 <Skeleton className="h-32 w-full" />
             </div>
             <div>
                 <Skeleton className="h-72 w-full" />
             </div>
         </div>
     </div>
   </div>
  );
}

function RsvpForm({ eventId, slug, onRsvpSuccess }: { eventId: string, slug: string, onRsvpSuccess: () => void }) {
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;

    if (eventId === 'demo-event') {
        toast({ title: "Demo RSVP Recorded!", description: "In a real event, this would save your ticket." });
        router.push(`/event/${slug}/success?ticketId=demo-ticket-12345`);
        return;
    }
    
    setIsSubmitting(true);
    try {
      const ticketId = crypto.randomUUID();
      await databases.createDocument(DATABASE_ID, RSVPS_COLLECTION_ID, ID.unique(), {
        eventId: eventId,
        name: rsvpName,
        email: rsvpEmail,
        ticketId: ticketId,
      });

      // No need to call onRsvpSuccess here anymore, realtime will handle it
      toast({
        title: "You're In!",
        description: "Your spot is confirmed. Redirecting...",
      });
      router.push(`/event/${slug}/success?ticketId=${ticketId}`);

    } catch (error) {
      const appwriteError = error as AppwriteException;
      toast({
        title: 'RSVP Failed',
        description: appwriteError.message || 'Could not complete your RSVP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRsvpSubmit}>
      <CardHeader>
        <CardTitle>Reserve Your Spot</CardTitle>
        <CardDescription>Fill out the form to get your ticket.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            value={rsvpName}
            onChange={(e) => setRsvpName(e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            value={rsvpEmail}
            onChange={(e) => setRsvpEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full button-default" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Reserving...' : 'Get My Ticket'}
        </Button>
      </CardContent>
    </form>
  );
}


export default function EventPage({ params }: { params: { slug: string } }) {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { slug } = params;
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      setIsLoading(true);

      if (slug === 'demo-event') {
          // For the demo, let's cycle through themes to showcase them
          const themes: EventData['theme'][] = ['quantum', 'warp', 'classic', 'minimal'];
          const randomTheme = themes[Math.floor(Math.random() * themes.length)];
          setEventData({ ...DEMO_EVENT_DATA, theme: randomTheme });
          setIsLoading(false);
          return;
      }

      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          EVENTS_COLLECTION_ID,
          [Query.equal('slug', slug), Query.limit(1)]
        );

        if (response.documents.length === 0) {
          notFound();
          return;
        }

        const event = response.documents[0] as EventDocument;
        let coverUrl = `https://picsum.photos/1200/400?random=${event.$id}`;
        let logoUrl: string | undefined = undefined;

        if (event.coverFileId) {
          try {
            const url = storage.getFilePreview(COVERS_BUCKET_ID, event.coverFileId);
            coverUrl = url.href;
          } catch (e) {
            console.error("Failed to get file preview", e);
          }
        }
        
        if (event.logoFileId) {
          try {
            const url = storage.getFilePreview(LOGOS_BUCKET_ID, event.logoFileId);
            logoUrl = url.href;
          } catch (e) {
            console.error("Failed to get logo file preview", e);
          }
        }
        
        const rsvpResponse = await databases.listDocuments(
            DATABASE_ID,
            RSVPS_COLLECTION_ID,
            [Query.equal('eventId', event.$id), Query.limit(0)]
        );

        setEventData({
          id: event.$id,
          title: event.title,
          description: event.description,
          coverUrl,
          logoUrl,
          startTime: new Date(event.startAt),
          endTime: new Date(event.endAt),
          location: event.location,
          rsvpCount: rsvpResponse.total,
          theme: event.theme || 'minimal',
        });

      } catch (error) {
        console.error('Failed to fetch event:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch event details.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [slug, toast]);
  
  useEffect(() => {
    if (!eventData || eventData.id === 'demo-event') return;

    const unsubscribe = client.subscribe(
        `databases.${DATABASE_ID}.collections.${RSVPS_COLLECTION_ID}.documents`,
        (response) => {
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                const newRsvp = response.payload as Models.Document & { eventId: string };
                if (newRsvp.eventId === eventData.id) {
                     setEventData(prev => prev ? { ...prev, rsvpCount: prev.rsvpCount + 1 } : null);
                }
            }
        }
    );

    return () => {
        unsubscribe();
    };

  }, [eventData]);


  if (isLoading) {
    return <EventPageSkeleton />;
  }

  if (!eventData) {
    return null;
  }

  const { id, title, description, coverUrl, logoUrl, startTime, endTime, location, rsvpCount, theme } = eventData;
  
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = `${startTime.toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })}`;

  const handleRsvpSuccess = () => {
      // This function is kept in case we need it for other purposes,
      // but the counter is now handled by the realtime subscription.
  }

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  return (
    <div className={cn('event-page', `theme-${theme}`)}>
      <section className="relative h-96 w-full">
         <Image
          src={coverUrl}
          alt={title}
          fill
          className="object-cover"
          data-ai-hint="event cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative mx-auto h-full flex flex-col items-center justify-center text-center text-white z-10">
          {logoUrl && (
            <div className="relative h-24 w-24 mb-4 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
                <Image src={logoUrl} alt={`${title} logo`} fill className="object-cover" />
            </div>
          )}
          <h1 className={cn("text-4xl md:text-6xl font-bold tracking-tight", theme === 'classic' ? 'font-headline-serif' : 'font-headline')}>{title}</h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg mt-4 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{formattedDate} &bull; {formattedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{location}</span>
              </div>
          </div>
          <div className="mt-8">
            <Countdown targetDate={startTime} />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          <div className="lg:col-span-2 space-y-12">
             <div>
                <h2 className={cn("text-2xl font-bold mb-4", theme === 'classic' ? 'font-headline-serif' : 'font-headline')}>About this Event</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
                    <p>{description}</p>
                </div>
             </div>
             <div>
                <h2 className={cn("text-2xl font-bold mb-4", theme === 'classic' ? 'font-headline-serif' : 'font-headline')}>Location</h2>
                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={mapEmbedUrl}
                        title={location}
                        aria-label={location}
                    ></iframe>
                </div>
             </div>
          </div>

          <div>
            <Card className="shadow-xl sticky top-24">
               <div className="p-4 border-b">
                 <div className="flex items-center gap-2 text-primary">
                    <Users className="w-5 h-5" />
                    <span className="font-bold text-lg">{rsvpCount}</span>
                    <span className="text-sm text-muted-foreground">people already attending</span>
                  </div>
               </div>
               <RsvpForm eventId={id} slug={slug} onRsvpSuccess={handleRsvpSuccess} />
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
