'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { databases } from '@/lib/appwrite';
import { DATABASE_ID, EVENTS_COLLECTION_ID } from '@/lib/appwrite-config';
import { Models, Query } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EventDocument extends Models.Document {
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  coverFileId?: string;
  logoFileId?: string;
  theme: string;
  isPublic: boolean;
}

interface EventCardProps {
  event: EventDocument;
}

function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startAt);
  const endDate = new Date(event.endAt);

  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = `${startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })} - ${endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;

  // Generate cover image URL
  const coverUrl = event.coverFileId
    ? `https://syd.cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_COVERS_BUCKET_ID}/files/${event.coverFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    : `https://images.unsplash.com/1200x400?random=${event.$id}&fit=crop&auto=format&q=80`;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={coverUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            <Eye className="w-3 h-3 mr-1" />
            Public
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className={cn(
            'capitalize',
            event.theme === 'quantum' && 'bg-purple-500',
            event.theme === 'warp' && 'bg-blue-500',
            event.theme === 'classic' && 'bg-gray-800',
            event.theme === 'minimal' && 'bg-green-500'
          )}>
            {event.theme}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {event.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Live RSVPs</span>
          </div>
          <div className="text-sm font-medium text-primary">
            {formattedTime}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/event/${event.slug}`}>
            View Event
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function DiscoverPage() {
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [dateFilter, locationFilter, themeFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      let queries = [
        Query.equal('isPublic', true),
        Query.orderAsc('startAt'),
      ];

      // Add date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        switch (dateFilter) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            break;
          case 'week':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            break;
          default:
            startDate = now;
            endDate = new Date(2030, 0, 1);
        }

        queries.push(Query.greaterThanEqual('startAt', startDate.toISOString()));
        queries.push(Query.lessThanEqual('startAt', endDate.toISOString()));
      }

      // Add theme filter
      if (themeFilter !== 'all') {
        queries.push(Query.equal('theme', themeFilter));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        queries
      );

      // Filter by search query and location on client side
      let filteredEvents = response.documents as EventDocument[];

      if (searchQuery) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (locationFilter !== 'all') {
        filteredEvents = filteredEvents.filter(event =>
          event.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEvents();
  };

  const featuredEvents = events.slice(0, 3);
  const regularEvents = events.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find the perfect events happening around you. From tech meetups to creative workshops,
            discover experiences that inspire and connect.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search events by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="px-8">
                Search
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={themeFilter} onValueChange={setThemeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="quantum">Quantum</SelectItem>
                <SelectItem value="warp">Warp</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Filter by location..."
              value={locationFilter === 'all' ? '' : locationFilter}
              onChange={(e) => setLocationFilter(e.target.value || 'all')}
              className="w-40"
            />
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
                : featuredEvents.map((event) => (
                    <EventCard key={event.$id} event={event} />
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {searchQuery || dateFilter !== 'all' || locationFilter !== 'all' || themeFilter !== 'all'
                ? 'Search Results'
                : 'All Events'
              }
            </h2>
            <p className="text-muted-foreground">
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or check back later for new events.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setDateFilter('all');
                setLocationFilter('all');
                setThemeFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularEvents.map((event) => (
                <EventCard key={event.$id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
