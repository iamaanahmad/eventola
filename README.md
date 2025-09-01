
# ✨ Eventola - Create Stunning Event Microsites in Minutes

**Eventola** is a full-featured, AI-powered platform that empowers organizers to create beautiful, professional event microsites with zero code. Featuring live RSVPs, QR code ticketing, and multiple high-quality themes, Eventola is designed to make your event a success from the moment you share the link.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Appwrite](https://img.shields.io/badge/Built%20with-Appwrite-ff0066.svg?style=flat)](https://appwrite.io)

**Built for the Appwrite Sites Hackathon.**

---

### 🚀 Live Demo & Repository

- **Live Site:** [**eventola.appwrite.network**](https://eventola.appwrite.network) *(Replace with your final URL)*
- **GitHub Repo:** [**github.com/iamaanahmad/eventola**](https://github.com/iamaanahmad/eventola)

### 💡 Inspiration

In a world of countless online events, meetups, and workshops, organizers need a tool that is as dynamic and exciting as the events they host. Generic sign-up forms and bland landing pages fail to capture the energy of an event. We built Eventola to solve this problem: to provide a tool that is not only functional but also fun, allowing anyone to create a stunning, professional, and engaging event page in under 60 seconds.

---

### 🌟 Core Features

#### For Organizers:

- **🔐 Secure Authentication:** Easy and secure account creation and login for organizers.
- **🎨 Themed Event Creation:** Choose from multiple high-quality themes (**Minimal, Warp, Quantum, Classic**) to match your event's vibe.
- **🖼️ Custom Branding:** Upload a custom cover image and event logo for a fully branded experience.
- **🤖 AI-Powered Content:**
    - **AI Description Generator:** Just provide a title, and let AI write a compelling event description for you.
    - **AI Tagline Generator:** Instantly create catchy taglines for your event marketing.
- **🎛️ Unified Dashboard:** Manage all your events—drafts and published—from a single, intuitive dashboard.

#### For Attendees:

- **🌐 Beautiful Event Microsites:** A unique, shareable page for each event with a stunning, theme-based design.
- **⚡ Real-time RSVP Counter:** Watch the attendee count increase live, building social proof and excitement.
- **🎟️ Instant QR Code Tickets:** Receive a unique QR code ticket immediately after RSVPing, ready for check-in.
- **📅 Countdown Timer:** An animated countdown builds anticipation for the event's start.
- **🗺️ Interactive Map:** An embedded Google Map shows the event location.
- **🎉 Celebratory UI:** A fun confetti animation celebrates a successful RSVP.

---

### 🏆 The Hackathon "WOW" Factor

What makes Eventola stand out?

1.  **AI-First Workflow:** We didn't just add AI; we integrated it into the core creation process. The **Description and Tagline Generators** save organizers time and creative energy, making the platform incredibly efficient.
2.  **Appwrite Realtime in Action:** The **live RSVP counter** is a perfect demonstration of Appwrite's Realtime capabilities. It updates instantly across all clients without needing a page refresh, creating a dynamic and engaging experience for potential attendees.
3.  **High-Quality, Thematic Design:** The event pages aren't just functional; they're beautiful. With themes like **Warp** and **Quantum**, we showcase how modern web design (gradients, glassmorphism, custom fonts) can create an immersive user experience.
4.  **End-to-End Solution:** From organizer sign-up to attendee ticket generation, Eventola is a complete, self-contained platform, all powered by Appwrite's backend-as-a-service.

---

### 🛠️ Tech Stack & Implementation

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with custom themes
- **UI Components:** ShadCN/UI
- **AI/Generative:** Google AI (Gemini) via Genkit
- **Backend:** Appwrite (Cloud)

---

### ☁️ How Appwrite is Used

Eventola is powered entirely by Appwrite, showcasing its strength as an all-in-one backend solution.

- **Appwrite Authentication:** Manages secure user (organizer) sign-up and login sessions using Email/Password.
- **Appwrite Databases:**
    - **`events` Collection:** Stores all event data, including title, description, theme, location, and file IDs for images.
    - **`rsvps` Collection:** Stores every RSVP, linking attendees to specific events and generating unique ticket IDs.
- **Appwrite Storage:**
    - **`event-covers` Bucket:** Securely hosts all uploaded cover images for event pages.
    - **`event-logos` Bucket:** Securely hosts all uploaded event logos.
- **Appwrite Realtime:** Powers the live RSVP counter on public event pages. It subscribes to the `rsvps` collection and updates the UI instantly whenever a new RSVP is created.

---

### 🔧 Getting Started

#### Prerequisites

- Node.js & npm
- An Appwrite Cloud account

#### 1. Clone the Repository

```bash
git clone https://github.com/iamaanahmad/eventola.git
cd eventola
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set up Appwrite Backend

1. **Create a Project:** Log in to your Appwrite Cloud account and create a new project called "Eventola".

2. **Configure Authentication:**
   - Go to **Authentication** → **Settings**
   - Enable **Email/Password** authentication method

3. **Set up Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   APPWRITE_ENDPOINT=https://syd.cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your-project-id-here
   GEMINI_API_KEY=your-google-ai-api-key
   ```

4. **Run the Automated Setup Script:**
   ```bash
   # Set your Appwrite server API key (create one in Appwrite Console → API Keys)
   export APPWRITE_API_KEY=your-server-api-key

   # Run the setup script
   node setup-appwrite.js
   ```

   This script will automatically create:
   - Database: `events_db`
   - Collections: `events` and `rsvps`
   - Storage buckets: `event-covers` and `event-logos`
   - All necessary attributes and permissions

5. **Manual Setup (Alternative):**
   If the script doesn't work, you can set up manually in the Appwrite Console:

   **Database Setup:**
   - Create database: `events_db`
   - Create collection `events` with attributes:
     - `ownerUserId` (string, required)
     - `title` (string, required)
     - `slug` (string, required)
     - `description` (string, required)
     - `location` (string, required)
     - `startAt` (datetime, required)
     - `endAt` (datetime, required)
     - `coverFileId` (string, optional)
     - `logoFileId` (string, optional)
     - `status` (string, required)
     - `theme` (string, required)

   - Create collection `rsvps` with attributes:
     - `eventId` (string, required)
     - `name` (string, required)
     - `email` (string, required)
     - `ticketId` (string, required)

   **Storage Setup:**
   - Create bucket `event-covers` for event cover images
   - Create bucket `event-logos` for event logo images
   - Set permissions to allow public read access


#### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

---

### 🧑‍💻 Test Credentials

To make testing easier for the judges, you can use the following credentials to log in and explore the organizer dashboard.

-   **Email:** `organizer@eventola.com`
-   **Password:** `password123`

*(Note: You will need to register this user first through the `/register` page).*

