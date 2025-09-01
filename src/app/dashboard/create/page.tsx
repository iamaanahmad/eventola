'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ChevronLeft, Sparkles, Upload, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { account, databases, storage, ID } from '@/lib/appwrite';
import { DATABASE_ID, EVENTS_COLLECTION_ID, COVERS_BUCKET_ID, LOGOS_BUCKET_ID } from '@/lib/appwrite-config';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AppwriteException } from 'appwrite';
import Image from 'next/image';
import { generateDescriptionAction } from '@/app/actions';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  location: z.string().min(3, 'Location is required.'),
  date: z.date({ required_error: 'Event date is required.' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format.'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format.'),
  status: z.enum(['draft', 'published']),
  theme: z.enum(['minimal', 'warp', 'quantum', 'classic']),
});

type EventFormValues = z.infer<typeof eventSchema>;

// NOTE: Database and storage IDs are imported from appwrite-config.ts


export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: 'Community Tech Day',
      description: 'Join us for a day of tech talks, workshops, and networking.',
      location: 'Tech Hub Convention Center',
      startTime: '09:00',
      endTime: '17:00',
      status: 'draft',
      theme: 'minimal',
    },
  });
  
  const selectedTheme = watch('theme');

  const handleGenerateDescription = async () => {
    const eventTitle = getValues('title');
    if (!eventTitle || eventTitle.length < 3) {
      toast({
        title: 'Please enter a title first',
        description: 'The event title is needed to generate a description.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateDescriptionAction({ eventTitle });
      if ('description' in result) {
        setValue('description', result.description, { shouldValidate: true });
        toast({
          title: 'Description generated!',
          description: 'The AI has crafted a new description for your event.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Generation Failed',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };
  
  const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoImage(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    try {
      let coverFileId: string | undefined = undefined;
      let logoFileId: string | undefined = undefined;

      // 1. Upload cover image if it exists
      if (coverImage) {
        toast({ title: 'Uploading cover image...' });
        const fileResponse = await storage.createFile(COVERS_BUCKET_ID, ID.unique(), coverImage);
        coverFileId = fileResponse.$id;
      }
      
      // 2. Upload logo image if it exists
      if (logoImage) {
        toast({ title: 'Uploading logo...' });
        const logoResponse = await storage.createFile(LOGOS_BUCKET_ID, ID.unique(), logoImage);
        logoFileId = logoResponse.$id;
      }

      // 3. Get current user
      const user = await account.get();

      // 4. Combine date and time
      const startAt = new Date(data.date);
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      startAt.setHours(startHour, startMinute);

      const endAt = new Date(data.date);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);
      endAt.setHours(endHour, endMinute);

      // 5. Create slug from title
      const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      // 6. Save event to database
      toast({ title: 'Saving event...' });
      await databases.createDocument(DATABASE_ID, EVENTS_COLLECTION_ID, ID.unique(), {
        ownerUserId: user.$id,
        title: data.title,
        slug,
        description: data.description,
        location: data.location,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        coverFileId,
        logoFileId,
        status: data.status,
        theme: data.theme,
      });

      toast({
        title: 'Event Created!',
        description: 'Your event has been saved successfully.',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Event creation failed:', error);
      const appwriteError = error as AppwriteException;
      toast({
        title: 'Event Creation Failed',
        description: appwriteError.message || 'An unexpected error occurred. Make sure your Appwrite database and storage are set up correctly.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Create New Event
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          Draft
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" type="button" onClick={() => router.push('/dashboard')}>
            Discard
          </Button>
          <Button size="sm" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Event'}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Fill in the essential details for your event. This information will be displayed on the public event page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" type="text" className="w-full" {...register('title')} />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                <div className="grid gap-3 relative">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description">Description</Label>
                     <Button size="sm" variant="ghost" type="button" onClick={handleGenerateDescription} disabled={isGenerating}>
                        <Sparkles className={cn("mr-2 h-4 w-4", isGenerating && "animate-pulse")} />
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                      </Button>
                  </div>
                  <Textarea id="description" className="min-h-32" {...register('description')} />
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Location</CardTitle>
              <CardDescription>Specify when and where your event will take place.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="date">Date</Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" type="text" {...register('location')} />
                  {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="time" {...register('startTime')} />
                  {errors.startTime && <p className="text-sm text-destructive">{errors.startTime.message}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input id="end-time" type="time" {...register('endTime')} />
                  {errors.endTime && <p className="text-sm text-destructive">{errors.endTime.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="theme">Theme</Label>
                   <Controller
                    name="theme"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="theme" aria-label="Select theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="warp">Warp</SelectItem>
                          <SelectItem value="quantum">Quantum</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                   <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="status" aria-label="Select status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>Upload a cover image. 1200x400 recommended.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 relative"
                  >
                    {coverPreview ? (
                      <Image src={coverPreview} alt="Cover preview" fill objectFit="cover" className="rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                      </div>
                    )}
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleCoverImageChange} accept="image/png, image/jpeg, image/gif" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Event Logo</CardTitle>
              <CardDescription>Upload a logo. Recommended square (1:1) format.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                 <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="logo-dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 relative"
                  >
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo preview" fill objectFit="contain" className="rounded-lg p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold">Click to upload logo</span>
                        </p>
                      </div>
                    )}
                    <input id="logo-dropzone-file" type="file" className="hidden" onChange={handleLogoImageChange} accept="image/png, image/jpeg, image/gif" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" type="button" onClick={() => router.push('/dashboard')}>
          Discard
        </Button>
        <Button size="sm" type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Event'}
        </Button>
      </div>
    </form>
  );
}
