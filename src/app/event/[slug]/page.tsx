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
import { DATABASE_ID, EVENTS_COLLECTION_ID, RSVPS_COLLECTION_ID, COVERS_BUCKET_ID, LOGOS_BUCKET_ID } from '@/lib/appwrite-config';
import { Models, Query, AppwriteException } from 'appwrite';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/footer';
import { Countdown } from '@/components/countdown';

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
    title: 'FutureSpark 2025 – The AI & Innovation Meetup',
    description: "FutureSpark 2025 is an interactive showcase of cutting-edge technologies, bringing together developers, designers, entrepreneurs, and AI enthusiasts.\n\n⚡ Live coding battles & hack demos\n\n🤖 AI startup pitches\n\n🎤 Talks from industry leaders\n\n🎉 Networking and collaboration\n\nJoin us to explore the future of AI, design, and innovation — in one electrifying evening.",
    coverUrl: 'https://i.ibb.co/pr1CHX3D/innovation-abstract.jpg',
    logoUrl: 'https://i.ibb.co/1GBx9bX1/image.png',
    startTime: new Date('2025-09-15T18:00:00'), // September 15, 2025, 6:00 PM
    endTime: new Date('2025-09-15T22:00:00'), // September 15, 2025, 10:00 PM
    location: 'T-Hub, Hyderabad, India',
    rsvpCount: 1337,
    theme: 'quantum'
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


export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvent = async () => {
      const resolvedParams = await params;
      const { slug } = resolvedParams;
      
      if (!slug) return;
      setCurrentSlug(slug);
      setIsLoading(true);

      if (slug === 'demo-event') {
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
            const url = storage.getFileView(COVERS_BUCKET_ID, event.coverFileId);
            coverUrl = url.href;
          } catch (e) {
            console.error("Failed to get file view", e);
            coverUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${COVERS_BUCKET_ID}/files/${event.coverFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
          }
        }
        
        if (event.logoFileId) {
          try {
            const url = storage.getFileView(LOGOS_BUCKET_ID, event.logoFileId);
            logoUrl = url.href;
          } catch (e) {
            console.error("Failed to get logo file view", e);
            logoUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${LOGOS_BUCKET_ID}/files/${event.logoFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
          }
        }
        
        const rsvpResponse = await databases.listDocuments(
            DATABASE_ID,
            RSVPS_COLLECTION_ID,
            [Query.equal('eventId', event.$id)]
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
  }, [params, toast]);
  
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
  }

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  return (
    <div className={cn('event-page', `theme-${theme}`)}>
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-end">
         <Image
          src={coverUrl}
          alt={title}
          fill
          className="object-cover"
          data-ai-hint="event cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />
        <div className="container relative z-10 text-white pb-8 md:pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <div className="md:col-span-2 flex flex-col justify-end">
                    {logoUrl && (
                        <div className="relative h-20 w-20 mb-4 rounded-lg overflow-hidden border-2 border-white/20 bg-black/20 backdrop-blur-sm p-1 shadow-lg">
                            <Image src={logoUrl} alt={`${title} logo`} fill className="object-contain" />
                        </div>
                    )}
                    <h1 className={cn("text-4xl md:text-6xl font-bold tracking-tight", theme === 'classic' ? 'font-headline-serif' : 'font-headline')}>{title}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2 text-lg mt-4 font-medium">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{formattedDate} &bull; {formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{location}</span>
                        </div>
                    </div>
                </div>
                 <div className="flex items-end justify-start md:justify-center">
                     <Countdown targetDate={startTime} />
                </div>
            </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          <div className="lg:col-span-2 space-y-12">
             <Card>
                <CardHeader>
                    <CardTitle className={cn("text-2xl", theme === 'classic' ? 'font-headline-serif' : 'font-headline')}>About this Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
                        <p>{description}</p>
                    </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                    <CardTitle className={cn("text-2xl", theme === 'classic' ? 'font-headline-serif' : 'font-headline')}>Location</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
             </Card>
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
               <RsvpForm eventId={id} slug={currentSlug} onRsvpSuccess={handleRsvpSuccess} />
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}