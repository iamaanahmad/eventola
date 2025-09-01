import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, MapPin, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { EventCardData } from "@/app/dashboard/page";

export function EventCard({ title, slug, date, location, coverUrl, attendees, status }: EventCardData) {
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
                <Link href={`/event/${slug}`} target="_blank">
                    <Image
                        alt={title}
                        className="aspect-video w-full rounded-t-lg object-cover"
                        height="200"
                        src={coverUrl}
                        width="300"
                        data-ai-hint="event poster"
                    />
                </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-bold leading-tight">
                        <Link href={`/event/${slug}`} className="hover:underline" target="_blank">{title}</Link>
                    </CardTitle>
                    <Badge variant={status === 'published' ? "default" : "secondary"}>{statusText}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{location}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
                <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-semibold">{attendees}</span>
                    <span className="text-muted-foreground ml-1.5">Attendees</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View Attendees</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}
