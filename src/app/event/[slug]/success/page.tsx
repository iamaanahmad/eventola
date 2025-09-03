
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Twitter, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

// A simple SVG for the WhatsApp icon, as lucide-react doesn't have it.
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);


export default function RsvpSuccessPage({ params }: { params: Promise<{ slug:string }> }) {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setCurrentSlug(resolvedParams.slug);
    };
    getSlug();
    
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    setPageUrl(window.location.href.split('/success')[0]);
    
    const timer = setTimeout(() => {
        setIsConfettiActive(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, [params]);

  if (!ticketId) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
          <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in-0 duration-500">
              <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>No ticket ID found. Please try RSVPing again.</CardDescription>
              </CardHeader>
              <CardContent>
                   <Link href={`/event/${currentSlug || 'demo-event'}`} className="text-primary hover:underline">
                      &larr; Back to event page
                  </Link>
              </CardContent>
          </Card>
      </div>
    )
  }

  const shareText = `I just RSVP'd for an event on Eventola! Check it out: ${pageUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <>
      {isConfettiActive && <Confetti width={dimensions.width} height={dimensions.height} />}
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
          <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
              <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 animate-in zoom-in-50 delay-300 duration-500">
                      <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400 scale-0 animate-in zoom-in-100 delay-500 duration-300 fill-mode-forwards" />
                  </div>
                  <CardTitle className="mt-4 text-2xl font-bold tracking-tight">You're In!</CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                      Your spot is confirmed! A confirmation email with your QR code ticket has been sent.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 animate-in fade-in-0 delay-700 duration-500 fill-mode-forwards">
                  <div className="rounded-lg border bg-muted p-4">
                      <h3 className="font-semibold text-lg mb-2">Your QR Code Ticket</h3>
                      <p className="text-sm text-muted-foreground mb-2">Show this QR at the event entrance.</p>
                      <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketId)}`}
                          alt="QR Code Ticket"
                          width={200}
                          height={200}
                          className="mx-auto rounded-md"
                          data-ai-hint="qr code"
                      />
                  </div>
                  <div className="flex w-full items-center justify-center gap-4">
                      <Button>
                          <Download className="mr-2" />
                          Download
                      </Button>
                      <Button variant="secondary" asChild>
                         <Link href={twitterUrl} target="_blank" rel="noopener noreferrer">
                             <Twitter className="mr-2" /> Share on X
                         </Link>
                      </Button>
                      <Button variant="secondary" asChild>
                         <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                             <WhatsAppIcon className="mr-2" /> WhatsApp
                         </Link>
                      </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                      <Link href={`/event/${currentSlug}`} className="text-primary hover:underline">
                          &larr; Back to event page
                      </Link>
                  </div>
              </CardContent>
          </Card>
      </div>
    </>
  );
}
