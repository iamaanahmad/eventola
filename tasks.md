Eventola (Appwrite Sites Hackathon)

Goal: Build a hackathon-winning web app that lets organizers create event microsites with realtime RSVPs & QR tickets, powered entirely by Appwrite Sites.

📂 1. Project Setup

 Initialize Next.js (App Router) project with TypeScript.

 Install dependencies: tailwindcss, @shadcn/ui, framer-motion, qrcode, appwrite.

 Setup TailwindCSS config with shadcn theme.

 Create folder structure:

/app → pages (dashboard, event, auth).

/components → UI components.

/lib → appwrite.ts, utils.ts.

/functions → PDF/AI.

/styles → globals.css.

🔑 2. Appwrite Setup (Backend)

 Create new Appwrite Cloud project.

 Enable Auth: email/password (for organizer login).

 Create Database Collections:

events: id, ownerUserId, title, slug, description, startAt, endAt, location, coverFileId, theme, createdAt.

rsvps: id, eventId, name, email, ticketId (uuid), createdAt, status.

 Create Storage bucket: for event cover images.

 Configure Realtime: subscriptions for RSVP collection.

 Create Functions:

generatePdf: Input eventId → return downloadable flyer.

generateTagline: Input event info → call AI API → return tagline.

 Setup Appwrite Sites: connect GitHub repo, configure auto-deploy.

🎨 3. Frontend – Core UI
Global

 Implement Navbar (logo, auth links).

 Add Theme Toggle (light/dark).

 Setup global Tailwind & layout.

Authentication

 Auth pages: /login, /register.

 Hook Appwrite Auth (signup/login/logout).

 Store session with Appwrite SDK.

 Protect dashboard routes (redirect if not logged in).

Dashboard (Organizer view)

 Dashboard homepage with list of created events.

 “Create Event” button → event creation form.

 Event form: title, description, date/time, location, cover image (upload to Storage).

 Save event to DB and redirect to dashboard list.

 Event card preview in dashboard (with edit/delete).

Public Event Page (/event/[slug])

 Fetch event details from DB.

 Render hero (cover image, title, description, date/time, location).

 RSVP form (name, email).

 On RSVP → insert into DB, generate ticket ID, create QR code, display confirmation.

 Show realtime RSVP counter (auto-update).

 Downloadable QR ticket image.

⚡ 4. Features – MVP

 Organizer auth & event creation.

 Public event page with RSVP.

 QR ticket per RSVP.

 Live RSVP counter (Realtime).

 Deployed app with working flows.

🚀 5. Stretch Features (Polish)

 PDF Export: Add “Download Flyer” button → call Appwrite Function → return flyer PDF.

 AI Tagline: When creating event, auto-generate tagline via Appwrite Function calling AI API.

 Analytics Dashboard: Chart RSVPs by time (using DB queries + Recharts).

 Social Sharing: Add OG tags, preview images.

 Custom Themes: Minimal / Gradient / Dark theme presets.

 Add to Calendar: Generate .ics file for event.

🧪 6. Testing & QA

 Test organizer signup/login.

 Test event creation with cover upload.

 Test public event page load (SEO, mobile).

 RSVP flow → confirm DB entry + QR download.

 Realtime RSVP counter works across two browsers.

 Test PDF export function.

 Test AI tagline function.

 Cross-browser/device check (Chrome, Edge, mobile).

🌍 7. Deployment

 Push code to GitHub repo.

 Connect repo to Appwrite Sites (auto-deploy from main).

 Add environment variables (Appwrite Project ID, API endpoint, etc.).

 Deploy Functions (PDF + AI).

 Validate site runs on public .appwrite.network URL.

🎥 8. Submission Deliverables

 Public deployed Site URL.

 GitHub repo (MIT License).

 Demo video (60–90s) showing:

Organizer login → create event → publish.

Open public event page.

RSVP flow with QR ticket.

Live RSVP counter in action.

Bonus: PDF flyer / AI tagline.

 README.md with:

Inspiration

Features

Tech stack

Appwrite usage breakdown

Setup instructions

Demo credentials (test login).

 Post project on DEV/Hashnode (if required).

 Submit on Hackathon portal before deadline.

🏅 9. Judge-Friendly Extras

 Pixel-perfect UI polish (spacing, typography).

 Small animations (fade-in hero, slide counters).

 Show Appwrite Console screenshots in README to prove usage.

 Provide test login credentials in README for organizers.

 Clear “How Appwrite is used” section in submission.
