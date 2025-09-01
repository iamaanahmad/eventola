'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { account, databases, storage } from '@/lib/appwrite';
import { Models, Query } from 'appwrite';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { TaglineGenerator } from '@/components/tagline-generator';

// NOTE: These IDs are placeholders. You should create these in your Appwrite console.
const DATABASE_ID = 'events_db';
const EVENTS_COLLECTION_ID = 'events';
const COVERS_BUCKET_ID = 'event-covers';

interface EventDocument extends Models.Document {
  title: string;
  slug: string;
  startAt: string;
  location: string;
  coverFileId?: string;
  attendees: number; 
  status: 'published' | 'draft';
  ownerUserId: string;
}

export interface EventCardData {
  title: string;
  slug: string;
  date: Date;
  location: string;
  coverUrl: string;
  attendees: number;
  status: 'published' | 'draft';
}

interface User extends Models.User<Models.Preferences> {
    name: string;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const currentUser = (await account.get()) as User;
        setUser(currentUser);
        
        const response = await databases.listDocuments(
            DATABASE_ID, 
            EVENTS_COLLECTION_ID,
            [Query.equal('ownerUserId', currentUser.$id)]
        );
        
        const userEvents = response.documents as EventDocument[];

        const eventsData = await Promise.all(
          userEvents.map(async (event) => {
            let coverUrl = `https://picsum.photos/300/200?random=${event.$id}`; 
            if (event.coverFileId) {
              try {
                const url = storage.getFilePreview(COVERS_BUCKET_ID, event.coverFileId);
                coverUrl = url.href;
              } catch (e) {
                console.error("Failed to get file preview", e);
              }
            }

            return {
              title: event.title,
              slug: event.slug,
              date: new Date(event.startAt),
              location: event.location,
              coverUrl: coverUrl,
              attendees: 0, // Placeholder for now
              status: event.status,
            };
          })
        );

        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast({
          title: 'Error Fetching Events',
          description: 'Could not retrieve your events. Have you set up the Appwrite database and collections?',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const publishedEvents = events.filter((e) => e.status === 'published');
  const draftEvents = events.filter((e) => e.status === 'draft');
  
  const renderEventGrid = (eventList: EventCardData[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {eventList.map((event) => (
        <EventCard key={event.slug} {...event} />
      ))}
    </div>
  );

  const renderEmptyState = (title: string, description: string) => (
      <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed rounded-lg mt-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
         <Button asChild className="mt-4">
          <Link href="/dashboard/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Event
          </Link>
        </Button>
      </div>
  )

  const renderLoadingState = () => (
     <div>
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-32" />
        </div>
        <div className="mt-4">
             <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
        </div>
    </div>
  )


  return (
    <>
      {isLoading ? renderLoadingState() : (
        <>
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Welcome back, {user?.name} 👋</h1>
            <Button asChild size="sm">
            <Link href="/dashboard/create">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create New Event</span>
            </Link>
            </Button>
        </div>
        <Tabs defaultValue="all" className="mt-4">
            <div className="flex items-center">
            <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            </div>
            <TabsContent value="all">
            {events.length > 0 ? renderEventGrid(events) : renderEmptyState("No Events Created", "Click 'Create New Event' to get started.")}
            </TabsContent>
            <TabsContent value="published">
            {publishedEvents.length > 0 ? renderEventGrid(publishedEvents) : renderEmptyState("No Published Events", "Your published events will appear here.")}
            </TabsContent>
            <TabsContent value="draft">
            {draftEvents.length > 0 ? renderEventGrid(draftEvents) : renderEmptyState("No Drafts", "Your draft events will appear here.")}
            </TabsContent>
        </Tabs>
        </>
      )}
       <section className="my-12 md:my-16">
          <TaglineGenerator />
        </section>
    </>
  );
}
