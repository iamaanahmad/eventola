
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate, QrCode, Users } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <section className="relative text-center py-16 md:py-24 animate-in fade-in-0 slide-in-from-top-8 duration-500">
            <div 
              className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--primary)/0.1)_1px,transparent_1px)] [background-size:32px_32px]" 
              aria-hidden="true" 
            />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">
              Create stunning event pages in minutes.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
             Turn ideas into events with a shareable microsite—live RSVPs and QR tickets included.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
               <Button asChild size="lg">
                  <Link href="/register">✨ Create Your Event</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/event/demo-event">See Demo Event</Link>
                </Button>
            </div>
          </section>

          <section className="py-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
             Launch your next event in four simple steps.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                step="1"
                title="Create Account"
                description="Sign up for a free account in seconds."
              />
              <FeatureCard
                 step="2"
                title="Add Details"
                description="Fill in your event title, date, location, and description."
              />
              <FeatureCard
                 step="3"
                title="Publish & Share"
                description="Go live and share your unique event link with your audience."
              />
              <FeatureCard
                 step="4"
                title="Collect RSVPs"
                description="Watch attendees register in real-time on your dashboard."
              />
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

interface FeatureCardProps {
  step: string;
  title: string;
  description: string;
}

function FeatureCard({ step, title, description }: FeatureCardProps) {
  return (
    <Card className="text-left hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
      <CardHeader>
         <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">{step}</div>
            <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
