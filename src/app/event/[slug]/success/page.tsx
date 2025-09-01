
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

export default function RsvpSuccessPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isConfettiActive, setIsConfettiActive] = useState(true);

  useEffect(() => {
    // This effect runs on the client-side
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const timer = setTimeout(() => {
        setIsConfettiActive(false);
    }, 5000); // Stop confetti after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!ticketId) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
          <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in-0 duration-500">
              <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>No ticket ID found. Please try RSVPing again.</CardDescription>
              </CardHeader>
              <CardContent>
                   <Link href={`/event/${params.slug}`} className="text-primary hover:underline">
                      &larr; Back to event page
                  </Link>
              </CardContent>
          </Card>
      </div>
    )
  }


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
                          Download QR Ticket
                      </Button>
                       <Button variant="secondary">
                          <Send className="mr-2" />
                          Share Event With Friends
                      </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                      <Link href={`/event/${params.slug}`} className="text-primary hover:underline">
                          &larr; Back to event page
                      </Link>
                  </div>
              </CardContent>
          </Card>
      </div>
    </>
  );
}
