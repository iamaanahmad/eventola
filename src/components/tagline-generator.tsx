'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Copy, Sparkles, Wand2 } from 'lucide-react';
import { generateTaglineAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const taglineFormSchema = z.object({
  eventTitle: z
    .string()
    .min(3, 'Event title must be at least 3 characters.')
    .max(100, 'Event title is too long.'),
  eventDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(500, 'Description is too long.'),
});

type TaglineFormValues = z.infer<typeof taglineFormSchema>;

export function TaglineGenerator() {
  const [generatedTagline, setGeneratedTagline] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TaglineFormValues>({
    resolver: zodResolver(taglineFormSchema),
    defaultValues: {
      eventTitle: '',
      eventDescription: '',
    },
  });

  const onSubmit = async (values: TaglineFormValues) => {
    setIsLoading(true);
    setGeneratedTagline(null);
    const result = await generateTaglineAction(values);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      setGeneratedTagline(result.tagline);
    }
  };

  const handleCopy = () => {
    if (generatedTagline) {
      navigator.clipboard.writeText(generatedTagline);
      toast({
        title: 'Copied to clipboard!',
        description: 'You can now paste the tagline anywhere.',
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          AI Tagline Generator
        </CardTitle>
        <CardDescription>
          Tell us about your event, and we'll craft the perfect tagline.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="eventTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Appwrite Hackathon '24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A week-long virtual event for developers to build amazing projects with Appwrite..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                'Generating...'
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Tagline
                </>
              )}
            </Button>
            
            {(isLoading || generatedTagline) && (
              <div className="mt-4 w-full p-4 rounded-lg border bg-secondary/50 min-h-[80px] flex items-center justify-center animate-in fade-in-0 duration-500">
                {isLoading && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Thinking of a catchy phrase...</span>
                  </div>
                )}
                {generatedTagline && (
                  <div className="flex items-center justify-between w-full">
                    <p className="text-lg font-medium text-secondary-foreground">"{generatedTagline}"</p>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy tagline</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
