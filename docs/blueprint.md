# **App Name**: EventSpark

## Core Features:

- Organizer Authentication: Enable organizers to sign up and log in using email/password via Appwrite Auth, securing the organizer dashboard with session-based protection.
- Event Creation: Provide a form for organizers to input event details (title, description, date/time, location, cover image), store the event data in the Appwrite Database, and upload cover images to Appwrite Storage, assigning a public slug (URL) for each event.
- Public Event Page: Display event data fetched from the Appwrite Database, showcasing a hero banner (cover image), title, description, location, and date/time, accessible via the public slug.
- RSVP System: Implement an RSVP form (name + email), store RSVP data in the Appwrite Database, generate a unique ticket ID and QR code upon RSVP, and provide a confirmation page with a downloadable QR image.
- Realtime RSVP Counter: Update the public event page with live RSVP counts via Appwrite Realtime, providing automatic updates without page reloads.
- AI-Powered Tagline Generation: Offer organizers the ability to generate a catchy event tagline using an AI-powered tool (Appwrite Function calling LLM API), enhancing event promotion efforts.
- PDF Flyer Export: Enable organizers to export event details as a PDF flyer via Appwrite Function, allowing for easy sharing and promotion.

## Style Guidelines:

- Primary color: Deep purple (#6750A4), chosen for its modern and sophisticated feel, aligning with the event-centric theme.
- Background color: Light gray (#F2F0F9), offering a clean and unobtrusive backdrop to ensure readability and focus on event details.
- Accent color: Soft lavender (#D0BCFF), used for interactive elements and highlights, providing a gentle contrast to the primary and background colors.
- Headline font: 'Space Grotesk' (sans-serif) for a modern and tech-forward feel, complementing the app's innovative nature; body text: 'Inter' (sans-serif) for readability.
- Use clean, minimalist icons sourced from a library like FontAwesome or Remix Icon to represent event categories and interactive elements, ensuring consistency and clarity.
- Implement a responsive, mobile-first design with a clean, card-based layout for event listings, RSVP forms, and other key UI elements, adapting seamlessly to various screen sizes.
- Incorporate subtle animations using framer-motion for smooth transitions, hover effects, and loading states, enhancing user engagement and providing a polished, professional feel.