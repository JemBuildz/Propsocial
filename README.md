# PropSocial AI 🏡⚡

> **Autonomous RESO MLS and Voice-to-Lead Digital Workforce for Modern Real Estate Agents and Brokerages.**

PropSocial AI bridges deterministic real estate data streams (RESO Web API, MLS OData) with an autonomous Gemini-powered agent workforce. It turns drive-time voice notes into viral local listing campaigns, revives dormant CRM databases with precision comp triggers, and dispatches leads in real time.

---

## 🌟 Core Digital Workforce

```
                      ┌──────────────────────────────┐
                      │    RESO Web API Poller       │
                      │  (Deterministic Go Worker)   │
                      └──────────────┬───────────────┘
                                     │ OData Deltas
             ┌───────────────────────┼──────────────────────┐
             ▼                       ▼                      ▼
┌─────────────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐
│ The Pocket Deal-Finder  │ │ MLS Dispatcher   │ │  The Campaign Marketer  │
│  (Gemini 2.5 Flash)     │ │ (Gemini Triage)  │ │ (Gemini Vision + Copy)  │
│ • Car Voice-to-Post     │ │ • Round-robin CRM│ │ • 30-Photo Inspection   │
│ • "Deal of Week" Drops  │ │ • Webhook SLA 90s│ │ • Full Launch Kits      │
│ • Database Revival Game │ └──────────────────┘ └───────────┬─────────────┘
└─────────────────────────┘                                  │
                                                             ▼
                                                ┌─────────────────────────┐
                                                │ The Showing Coordinator │
                                                │  (Conversational Agent) │
                                                │ • SMS / DM Tour Booking │
                                                │ • Live Calendar Lock-In │
                                                └─────────────────────────┘
```

1. **RESO Web API Poller** (Deterministic Worker)
   - Continuous 60s OData/RESO polling with zero token burn.
   - Detects price drops, new listings, and inventory delta triggers.

2. **The Pocket Deal-Finder** (Gemini 2.5 Flash)
   - Transcribes and refines in-car voice memos into high-converting social carousels and DM hooks.
   - Powers the daily *YES / SKIP Sphere Revival Game* to re-engage past clients.

3. **The MLS Dispatcher** (Gemini Flash Triage)
   - Brokerage routing rules engine with <90s SLA.
   - Dispatches leads directly to Follow Up Boss, kvCORE, Lofty, and custom webhooks.

4. **The Campaign Marketer** (Gemini Multimodal Vision + Copy)
   - Scans up to 30 listing photos to identify premium finishes (herringbone floors, Sub-Zero appliances, mountain views).
   - Generates MLS remarks, Instagram carousels, email blasts, and SMS announcements.

5. **The Showing Coordinator** (Conversational State Agent)
   - Intercepts tour inquiries via SMS/DM, syncs with Google/Outlook calendars, and confirms appointments.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **AI / Multimodal**: Google Gemini API (`@google/genai`)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS with modern dark UI styling

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/JemBuildz/Propsocial.git
cd Propsocial

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file from the example:
```bash
cp .env.example .env.local
```
Add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 📦 Scripts

- `npm run dev` - Launch local Vite dev server on port 3000
- `npm run build` - Create optimized production bundle
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run TypeScript type checking (`tsc --noEmit`)

---

## 📄 License

Proprietary / MIT - See repository details.
