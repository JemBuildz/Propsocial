import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Zap, 
  Mic, 
  Camera, 
  MessageSquare, 
  Calendar, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Smartphone, 
  RefreshCw, 
  Send, 
  Check, 
  X, 
  DollarSign, 
  Database, 
  Radio, 
  Sliders, 
  Layers, 
  ChevronRight,
  Flame,
  Lock,
  Award,
  PhoneCall,
  Terminal
} from 'lucide-react';
import { useAgUiStream } from './hooks/useAgUiStream';
import { AgUiInspector } from './components/AgUiInspector';

// Live Ticker Events Data
interface TickerEvent {
  id: number;
  type: string;
  badge: string;
  text: string;
  color: string;
  bg: string;
}

const TICKER_EVENTS: TickerEvent[] = [
  { id: 1, type: 'MLS_DELTA', badge: 'RESO API', text: '$25,000 Price Drop detected in 85296 • Buyer-Magnet Post drafted in 14s', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  { id: 2, type: 'VOICE_LEAD', badge: 'VOICE-TO-POST', text: '15s Car Voice Note -> IG Carousel published • 6 "LIST" Comment DMs auto-sent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { id: 3, type: 'SPHERE_REVIVAL', badge: 'SPHERE REVIVAL', text: 'Past Client (2023) replied in 3m: "Actually yes, we want to upsize this summer!"', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 4, type: 'DISPATCH', badge: 'MLS DISPATCHER', text: 'New Active Listing 742 Evergreen • Full Launch Kit + FUB Webhook fired in 68s', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { id: 5, type: 'SHOWING', badge: 'TOUR COORDINATOR', text: 'Saturday 2:00 PM Private Showing confirmed via SMS Poller • Added to Calendar', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
];

// Neighborhood presets for Tab 1 Simulator
interface VoicePreset {
  id: string;
  label: string;
  audioText: string;
  photos: string[];
  generatedCaption: string;
  keyword: string;
  dmPreview: string;
}

const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'gilbert',
    label: 'Historic Coffee & Bungalows (Gilbert, AZ)',
    audioText: '"Hey AI, just grabbed an iced latte near Downtown Gilbert—obsessed with these renovated 1970s brick ranches with huge backyards and no HOA. Tell people I have 3 pocket listings under $550k right here."',
    photos: ['Renovated Brick Ranch Exterior', 'Local Patio Coffee Spot'],
    generatedCaption: `That morning iced latte hits different when you're touring houses with actual backyard space and ZERO HOA fees. ☕🏡\n\nEveryone thinks you need $750k+ to get within 5 minutes of the Downtown Heritage District, but I just spotted 3 renovated brick homes tucked right in this pocket—all under $550k with diving pools and RV gates.\n\n👇 Comment "LIST" below and my digital assistant will DM you the private addresses and photos before the weekend open house rush!`,
    keyword: 'LIST',
    dmPreview: 'Hey Sarah! 👋 Just saw your comment! Here is the private link to the 3 non-HOA homes under $550k near Downtown: [propsocial.link/gilbert-3]. Are you looking to make a move in the next 60 days, or just keeping an eye on the neighborhood?'
  },
  {
    id: 'scottsdale',
    label: 'Modern Mid-Century Remodel (Scottsdale)',
    audioText: '"Driving through 85251 right now. Just walked a mid-century modern home with herringbone floors and Camelback mountain views from the kitchen. Have them comment VIEW for the off-market pricing sheet."',
    photos: ['Herringbone Kitchen Island', 'Camelback Mountain Patio View'],
    generatedCaption: `Name a better kitchen sink view than Camelback Mountain at golden hour... I'll wait. ⛰️✨\n\nJust stepped out of a private preview in 85251. White oak herringbone floors, commercial-grade range, and a backyard built for twilight entertaining—priced $40k below the last comp on this street.\n\n👇 Drop "VIEW" in the comments and I'll instantly DM you the floorplan and price sheet!`,
    keyword: 'VIEW',
    dmPreview: 'Hey Marcus! ⛰️ Just sent over the spec sheet and private photo gallery for that 85251 mid-century home: [propsocial.link/85251-view]. Want me to grab a 15-minute window for you to walk it this Thursday?'
  }
];

// Database Revival Contacts for Tab 3 Simulator
interface SphereContact {
  id: number;
  name: string;
  boughtDate: string;
  triggerEvent: string;
  equityEst: string;
  draftSms: string;
  clientReply: string;
}

const SPHERE_CONTACTS: SphereContact[] = [
  {
    id: 1,
    name: 'Mike & Elena Vance',
    boughtDate: 'Bought 26 months ago (412 Oak Creek Dr)',
    triggerEvent: 'Neighbor at 418 Oak Creek Dr just closed for $45,000 OVER asking in 4 days.',
    equityEst: '+$82,000 Est. New Equity',
    draftSms: 'Hey Mike & Elena! Hope you guys are doing awesome. Crazy quick heads up—418 Oak Creek right down your street just closed for $45k over asking! It bumped your home\'s rough value up quite a bit. Want me to text you the 1-page neighborhood breakdown just so you have it for your records?',
    clientReply: 'Whoa seriously?! Yes please send it over! Elena was literally just talking about needing a 4th bedroom now that Leo is walking 😂'
  },
  {
    id: 2,
    name: 'David & Chloe Park',
    boughtDate: 'Bought 34 months ago (1904 Desert Bloom Way)',
    triggerEvent: '3 buyer searches in your CRM matched their exact floorplan this week.',
    equityEst: 'High-Demand Floorplan Match',
    draftSms: 'Hey David & Chloe! Long time no talk! Random question—I have two relocating families who missed out on a single-story split floorplan just like yours in Desert Bloom this weekend. Zero pressure at all, just curious if you guys have thought about making a move in the next year if the price made sense?',
    clientReply: 'Hey!! Funny timing, David just switched to fully remote so we were wondering what we could get for our place right now. Let\'s chat Thursday!'
  },
  {
    id: 3,
    name: 'Jason Miller (Past Open House Lead)',
    boughtDate: 'Toured 9 months ago (Went quiet)',
    triggerEvent: 'Builder rate buy-down + $25k price cut in his saved zip code (85142).',
    equityEst: '$380/mo Lower Payment vs Last Fall',
    draftSms: 'Hey Jason! Remember last fall when we looked at those 4-beds in 85142? One of the builders just slashed $25k off an inventory home AND is locking 4.99% fixed rates this week. Brings the payment down almost $380/mo from when we last ran numbers. Want me to text you the flyer?',
    clientReply: 'Wait 4.99%?? Yeah shoot me the details, my lease is actually up in 60 days!'
  }
];

// Architecture Pipeline Nodes
interface ArchNode {
  id: string;
  step: string;
  title: string;
  type: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  tiers: string[];
  latency: string;
  summary: string;
  payload: string;
}

const ARCH_NODES: ArchNode[] = [
  {
    id: 'reso',
    step: '01',
    title: 'RESO Web API Poller',
    type: 'Deterministic Go Worker',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Database,
    iconColor: 'text-cyan-400',
    tiers: ['Indie ($69)', 'Solo ($199)', 'Boutique ($499)'],
    latency: '60s Poll Interval • $0 Token Cost',
    summary: 'Pure deterministic Go code polls OData/RESO endpoints every 60 seconds. Detects price drops, new listings, and status changes without burning AI tokens.',
    payload: `{ "event": "PRICE_DROP", "mlsId": "6794210", "delta": -25000, "zip": "85296", "photosCount": 32 }`
  },
  {
    id: 'pocket',
    step: '02',
    title: 'The Pocket Deal-Finder',
    type: 'Gemini 2.5 Flash Agent',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: Smartphone,
    iconColor: 'text-emerald-400',
    tiers: ['Indie ($69)', 'Solo ($199)', 'Boutique ($499)'],
    latency: '3.2s Multimodal Execution',
    summary: 'Lives in SMS/WhatsApp. Converts car voice notes into viral local posts, pitches "Deal of the Week" MLS drops when you have 0 listings, and runs the daily YES/SKIP Sphere Revival game.',
    payload: `{ "action": "DRAFT_DEAL_POST", "dmTriggerKeyword": "DEAL", "sphereMatch": "Mike & Elena (+45k Comp)" }`
  },
  {
    id: 'dispatcher',
    step: '03',
    title: 'The MLS Dispatcher',
    type: 'Gemini Flash Triage Agent',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    icon: Radio,
    iconColor: 'text-purple-400',
    tiers: ['Boutique ($499)'],
    latency: '1.1s Webhook Dispatch',
    summary: 'Evaluates brokerage routing rules on instant MLS deltas or hot DM leads. Fires round-robin webhooks directly into Follow Up Boss, kvCORE, or Lofty.',
    payload: `{ "webhook": "FollowUpBoss", "assignedAgent": "agent_04_round_robin", "slaTimer": "90s" }`
  },
  {
    id: 'marketer',
    step: '04',
    title: 'The Campaign Marketer',
    type: 'Gemini Vision + Copy Agent',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: Sparkles,
    iconColor: 'text-cyan-400',
    tiers: ['Solo ($199)', 'Boutique ($499)'],
    latency: '18s Full Launch Kit',
    summary: 'Inspects up to 30 listing photos automatically (spotting herringbone floors, Sub-Zero appliances, mountain views) and drafts MLS remarks, IG carousels, email blasts, and SMS announcements.',
    payload: `{ "detectedFeatures": ["Sub-Zero Fridge", "RV Gate"], "assetsGenerated": ["MLS", "IG", "Email", "SMS"] }`
  },
  {
    id: 'coordinator',
    step: '05',
    title: 'The Showing Coordinator',
    type: 'Conversational State Agent',
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: Calendar,
    iconColor: 'text-blue-400',
    tiers: ['Solo ($199)', 'Boutique ($499)'],
    latency: 'Real-Time SMS Poller',
    summary: 'Intercepts tour requests from DMs or buyer agents, cross-checks your live Google/Outlook calendar via MCP tools, and locks in confirmed showing appointments.',
    payload: `{ "showingStatus": "CONFIRMED", "slot": "Sat 2:00 PM", "calendarSynced": true }`
  }
];

export default function App() {
  // Active Simulator Tab ('voice' | 'deal' | 'sphere')
  const [activeSimTab, setActiveSimTab] = useState<'voice' | 'deal' | 'sphere'>('voice');

  // Tab 1 State (Voice-to-Post)
  const [selectedVoicePreset, setSelectedVoicePreset] = useState<VoicePreset>(VOICE_PRESETS[0]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceApproved, setVoiceApproved] = useState(false);

  // Tab 2 State (Zero-Listing Deal of the Week)
  const [dealPublished, setDealPublished] = useState(false);
  const [simulatedLeadsCount, setSimulatedLeadsCount] = useState(4);

  // Tab 3 State (Dead Database Revival Game)
  const [sphereIndex, setSphereIndex] = useState(0);
  const [sphereActionState, setSphereActionState] = useState<'idle' | 'sent' | 'skipped'>('idle');
  const [revivedCount, setRevivedCount] = useState(12);

  // Architecture Explorer State
  const [selectedArchNode, setSelectedArchNode] = useState<ArchNode>(ARCH_NODES[1]);

  // ROI Calculator State
  const [weeklyVoiceNotes, setWeeklyVoiceNotes] = useState(3);
  const [sphereContacts, setSphereContacts] = useState(200);
  const [monthlyListings, setMonthlyListings] = useState(2);
  const [avgCommission, setAvgCommission] = useState(10500);

  // Lead Capture Modal / Form State
  const [selectedTier, setSelectedTier] = useState('Solo / Top Producer ($199/mo)');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brokerage: '',
    SendLiveTestText: true
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Ticker Rotation
  const [tickerIdx, setTickerIdx] = useState(0);

  // AG-UI Protocol State
  const agUi = useAgUiStream();
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [customVoiceNote, setCustomVoiceNote] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % TICKER_EVENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for Tab 1
  const handleSelectVoicePreset = (preset: VoicePreset) => {
    setIsTranscribing(true);
    setVoiceApproved(false);
    setSelectedVoicePreset(preset);
    setTimeout(() => {
      setIsTranscribing(false);
    }, 450);
  };

  const handleRunAgUiVoiceAgent = async (overridePrompt?: string) => {
    const prompt = overridePrompt || (isCustomMode && customVoiceNote ? customVoiceNote : selectedVoicePreset.audioText);
    setVoiceApproved(false);
    setIsTranscribing(true);
    await agUi.runAgent(prompt, 'pocket-dealfinder', apiKey);
    setIsTranscribing(false);
  };

  const handleRunArchNodeProbe = async (node: ArchNode) => {
    setIsInspectorOpen(true);
    let agentId: 'reso-poller' | 'pocket-dealfinder' | 'mls-dispatcher' | 'campaign-marketer' | 'showing-coordinator' = 'pocket-dealfinder';
    if (node.id === 'reso') agentId = 'reso-poller';
    else if (node.id === 'dispatcher') agentId = 'mls-dispatcher';
    else if (node.id === 'marketer') agentId = 'campaign-marketer';
    else if (node.id === 'coordinator') agentId = 'showing-coordinator';

    await agUi.runAgent(
      `Probe execution for node [${node.title}] (${node.type}) - ${node.summary}`,
      agentId,
      apiKey
    );
  };

  // Handlers for Tab 3 (Sphere Game)
  const handleSphereDecision = (decision: 'yes' | 'skip') => {
    if (decision === 'yes') {
      setSphereActionState('sent');
      setRevivedCount((prev) => prev + 1);
    } else {
      setSphereActionState('skipped');
      setTimeout(() => {
        setSphereActionState('idle');
        setSphereIndex((prev) => (prev + 1) % SPHERE_CONTACTS.length);
      }, 400);
    }
  };

  const handleNextSphereCard = () => {
    setSphereActionState('idle');
    setSphereIndex((prev) => (prev + 1) % SPHERE_CONTACTS.length);
  };

  // Dynamic ROI Calculations
  const monthlyPosts = weeklyVoiceNotes * 4 + 4; // Includes 4 weekly MLS Deal-of-the-Week posts
  const monthlyDmConversations = Math.round(monthlyPosts * 2.4 + monthlyListings * 6.5);
  const monthlySphereTouches = Math.min(Math.round(sphereContacts * 0.18), 60);
  const monthlyBookedShowings = Math.max(
    1,
    Math.round(monthlyDmConversations * 0.16 + monthlySphereTouches * 0.11 + monthlyListings * 1.5)
  );
  const estimatedAnnualClosings = Math.max(1, Math.round(monthlyBookedShowings * 12 * 0.14));
  const projectedAnnualPipeline = estimatedAnnualClosings * avgCommission;

  // Handle Tier Selection & Scroll to Onboarding
  const handleChooseTier = (tierName: string) => {
    setSelectedTier(tierName);
    const el = document.getElementById('onboarding-funnel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const currentSphereContact = SPHERE_CONTACTS[sphereIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      
      {/* Top Real-Time Activity Ticker Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono uppercase tracking-wider text-[11px] font-bold px-2 py-0.5 rounded border shrink-0 bg-slate-800 border-slate-700 text-emerald-400">
              LIVE POD TELEMETRY
            </span>
            <div className="flex items-center gap-2 truncate transition-all duration-500">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TICKER_EVENTS[tickerIdx].bg} ${TICKER_EVENTS[tickerIdx].color}`}>
                {TICKER_EVENTS[tickerIdx].badge}
              </span>
              <span className="text-slate-300 truncate font-medium">
                {TICKER_EVENTS[tickerIdx].text}
              </span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-slate-400 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Human-in-the-Loop Gate Active
            </span>
            <span>•</span>
            <span className="font-mono text-slate-300">Avg Launch Velocity: 68.4s</span>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">PropSocial</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                RESO + AI Workforce
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#pocket-simulator" className="hover:text-emerald-400 transition-colors">Pocket Agent Demo</a>
            <a href="#pod-architecture" className="hover:text-emerald-400 transition-colors">Pod Architecture</a>
            <a href="#roi-calculator" className="hover:text-emerald-400 transition-colors">Commission Calculator</a>
            <a href="#pricing-tiers" className="hover:text-emerald-400 transition-colors">Workforce Tiers</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#onboarding-funnel"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Deploy My Pod</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-14 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs sm:text-sm font-medium mb-8 shadow-inner">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Built for Indie Realtors, Top Producers & Boutique Brokerages</span>
          </div>

          <h1 className="text-4xl sm:6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6">
            From MLS Trigger or Car Voice-Note to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400">
              Booked Showing in Under 90 Seconds.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed mb-10">
            Stop logging into bloated dashboards or posting social fluff that gets zero leads. PropSocial deploys specialized AI teammates that turn <strong className="text-white">15-second car voice notes</strong>, <strong className="text-white">live RESO MLS deltas</strong>, and <strong className="text-white">forgotten past clients</strong> into active commission pipelines—with 1-click human sign-off on every step.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a 
              href="#pocket-simulator"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all group"
            >
              <Smartphone className="w-5 h-5" />
              <span>Try the Interactive Pocket Agent Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#pricing-tiers"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base sm:text-lg border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
            >
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Compare Digital Workforce Tiers</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/70">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt; 90 Sec</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">MLS Entry to Full Campaign</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/70">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">0 Listings?</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Auto-Finds MLS "Deals of Week"</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/70">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">8 Seconds</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Comment-to-DM Lead Capture</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/70">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100% Control</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">1-Click Human Approval Gate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE "POCKET DEAL-FINDER" SIMULATOR */}
      <section id="pocket-simulator" className="py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Live Sandbox
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Test Drive "The Pocket Deal-Finder"
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Most agents hate logging into complicated software. Our entry-level AI partner lives right inside your text messages—turning your daily drive, MLS price drops, and old phone contacts into booked showings. Click each tab below to test the live workflow:
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveSimTab('voice')}
              className={`px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeSimTab === 'voice'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>1. Voice-Note to Lead Magnet</span>
            </button>

            <button
              onClick={() => setActiveSimTab('deal')}
              className={`px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeSimTab === 'deal'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>2. Zero-Listing "Deal of the Week"</span>
            </button>

            <button
              onClick={() => setActiveSimTab('sphere')}
              className={`px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeSimTab === 'sphere'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>3. Dead Database Revival Game</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl">
            {activeSimTab === 'voice' && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                      STEP 1: 9:00 AM SMS PROMPT FROM YOUR AI
                    </span>
                    <span className="text-xs text-slate-400">Zero typing required</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="bg-slate-800/90 rounded-2xl rounded-tl-none p-3.5 text-sm text-slate-200">
                        "Morning! ☀️ Which neighborhood are you driving through today? Text me 2 quick phone photos and a 15-second voice note about what you spotted."
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Car Voice Note Source:
                        </label>
                        <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[11px] font-mono">
                          <button
                            onClick={() => setIsCustomMode(false)}
                            className={`px-2.5 py-1 rounded transition-colors ${
                              !isCustomMode ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Presets
                          </button>
                          <button
                            onClick={() => setIsCustomMode(true)}
                            className={`px-2.5 py-1 rounded transition-colors ${
                              isCustomMode ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Custom Memo
                          </button>
                        </div>
                      </div>

                      {!isCustomMode ? (
                        <div className="space-y-2.5">
                          {VOICE_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => {
                                handleSelectVoicePreset(preset);
                              }}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                selectedVoicePreset.id === preset.id
                                  ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Mic className={`w-4 h-4 ${selectedVoicePreset.id === preset.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                                <span className="text-sm font-medium">{preset.label}</span>
                              </div>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">0:15s</span>
                            </button>
                          ))}
                          <button
                            onClick={() => handleRunAgUiVoiceAgent(selectedVoicePreset.audioText)}
                            disabled={agUi.isRunning}
                            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                          >
                            <Terminal className="w-4 h-4" />
                            <span>{agUi.isRunning ? 'Agent Streaming...' : `Run AG-UI Stream on "${selectedVoicePreset.keyword}" Preset`}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            rows={3}
                            value={customVoiceNote}
                            onChange={(e) => setCustomVoiceNote(e.target.value)}
                            placeholder="e.g. Just drove past a Spanish villa in Paradise Valley with a 4-car garage, pool, and guest casita. Have buyers comment CASITA for off-market pricing."
                            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                          />
                          <button
                            onClick={() => handleRunAgUiVoiceAgent()}
                            disabled={agUi.isRunning || !customVoiceNote.trim()}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                          >
                            <Terminal className="w-4 h-4" />
                            <span>Stream via AG-UI Protocol</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl rounded-tr-none p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-emerald-300">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5" /> Your Raw Car Voice Note
                        </span>
                        <span className="font-mono">Gemini 2.5 Multimodal</span>
                      </div>
                      <p className="text-xs sm:text-sm italic text-slate-200 leading-relaxed">
                        {isCustomMode && customVoiceNote ? customVoiceNote : selectedVoicePreset.audioText}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedVoicePreset.photos.map((photo, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
                            <Camera className="w-3.5 h-3.5 text-cyan-400" /> {photo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      STEP 2: INSTANT LEAD-MAGNET POST + COMMENT-TO-DM CLOSER
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsInspectorOpen(true)}
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>Inspect AG-UI</span>
                      </button>
                      <span className="text-xs text-emerald-400 font-mono">
                        {agUi.isRunning ? 'Streaming...' : 'Generated in 2.8s'}
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl bg-slate-900 border border-slate-800 transition-opacity duration-300 ${isTranscribing && !agUi.isRunning ? 'opacity-40' : 'opacity-100'}`}>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-sm">
                          YOU
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Your Local Real Estate Page</div>
                          <div className="text-xs text-slate-400">Instagram & Facebook Carousel • Hyper-Local Hook</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Keyword Trigger: "{selectedVoicePreset.keyword}"
                      </span>
                    </div>

                    {/* Pending HITL Notification Banner */}
                    {agUi.pendingHitl && (
                      <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
                        <span className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>AG-UI HITL Gate: Approval Required to Publish</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => agUi.resolveHitl(agUi.pendingHitl!.toolCallId, false)}
                            className="px-2.5 py-1 text-xs bg-red-950/80 text-red-300 border border-red-500/40 rounded-lg hover:bg-red-900 transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              agUi.resolveHitl(agUi.pendingHitl!.toolCallId, true);
                              setVoiceApproved(true);
                            }}
                            className="px-3.5 py-1 text-xs bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors shadow-md"
                          >
                            Approve Now
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-line text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 mb-5 min-h-[120px]">
                      {agUi.streamedText || selectedVoicePreset.generatedCaption}
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> Auto-DM Armed (Fires 8 Seconds After Any "{selectedVoicePreset.keyword}" Comment):
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        "{selectedVoicePreset.dmPreview}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Human-in-the-Loop: Nothing posts until you tap Approve.</span>
                      </div>

                      {!voiceApproved ? (
                        <button
                          onClick={() => {
                            if (agUi.pendingHitl) {
                              agUi.resolveHitl(agUi.pendingHitl.toolCallId, true);
                            }
                            setVoiceApproved(true);
                          }}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>1-Click Approve & Arm Auto-DM</span>
                        </button>
                      ) : (
                        <div className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Published! Comment-to-DM Webhook Listening...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSimTab === 'deal' && (
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                    SOLVES THE #1 SOLO AGENT PROBLEM
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Have Zero Active Listings? Your AI Finds a "Deal of the Week" For You.
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    New and solo realtors churn from generic social tools because when they don't have a listing, they have nothing to post.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Every Tuesday at 8:30 AM, our <strong className="text-white">RESO Web API Poller</strong> scans your local MLS for dramatic price cuts, fixer-uppers, or builder incentives—and texts you a ready-to-post <strong className="text-cyan-400">"Deal of the Week"</strong> buyer magnet so you capture unrepresented buyers.
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-mono text-slate-400">LIVE RESO TRIGGER DETECTED:</div>
                    <div className="text-sm font-bold text-white">MLS #6810442 • $25,000 Price Drop (4 Bed + Pool)</div>
                    <div className="text-xs text-emerald-400">Compliance Note: Automatically credits listing brokerage per MLS IDX rules.</div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Tuesday 8:30 AM Text From Your Pocket Agent</div>
                        <div className="text-xs text-slate-400">RESO OData Delta -&gt; Buyer Lead Campaign</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                      -$25,000 Delta
                    </span>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                    <p className="text-sm text-slate-200 leading-relaxed">
                      "Hey! Even though you don't have a new listing this week, a 4-bed pool home in **85296** just slashed its price by **$25,000** (18 minutes ago on the MLS). Want me to publish this **'Tuesday Deal of the Week'** post and send you every buyer who comments **'POOL'**?"
                    </p>
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                      <div className="font-bold text-cyan-400">GENERATED HOOK PREVIEW:</div>
                      <p>"🚨 $25,000 PRICE DROP ALERT in 85296! A 4-bedroom home with a pebble-tec diving pool just cut its price to get sold this weekend. With seller concessions, you can get in with ~$14k down. Comment **'POOL'** and I'll DM you the address &amp; payment breakdown!"</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-slate-400">
                      Simulated Buyer DMs Captured Today: <strong className="text-emerald-400 text-sm">{simulatedLeadsCount} Qualified Buyers</strong>
                    </div>

                    {!dealPublished ? (
                      <button
                        onClick={() => {
                          setDealPublished(true);
                          setSimulatedLeadsCount((c) => c + 3);
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Reply "YES" to Launch Buyer Magnet</span>
                      </button>
                    ) : (
                      <div className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>Live! +3 Local Buyers Just Commented "POOL"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSimTab === 'sphere' && (
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold">
                    60-SECOND DAILY COMMISSION GAME
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Turn Forgotten Phone Contacts Into Listings While At a Stoplight.
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    88% of homeowners say they'd use their realtor again, yet only 13% do because agents forget to follow up with real value.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Every afternoon, your Pocket Agent cross-references your past clients and cold leads against live neighborhood MLS comps—and texts you <strong className="text-white">one hyper-relevant check-in</strong>. You just tap <strong className="text-emerald-400">YES</strong> or <strong className="text-slate-300">SKIP</strong>.
                  </p>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-3xl font-extrabold text-amber-400">{revivedCount}</div>
                    <div className="text-xs text-slate-300">
                      <div className="font-bold text-white">Sphere Conversations Revived This Month</div>
                      <div>Avg 1-to-1 Reply Rate: 44% (Feels 100% personal, never spammy)</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs font-mono uppercase text-amber-400 block">
                          CONTACT CARD {sphereIndex + 1} OF {SPHERE_CONTACTS.length}
                        </span>
                        <h4 className="text-xl font-bold text-white mt-0.5">{currentSphereContact.name}</h4>
                        <p className="text-xs text-slate-400">{currentSphereContact.boughtDate}</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {currentSphereContact.equityEst}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200 flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>MLS Comp Match:</strong> {currentSphereContact.triggerEvent}</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-xs font-mono text-slate-400 uppercase">AI-Drafted Personal Text Message:</div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        "{currentSphereContact.draftSms}"
                      </p>
                    </div>

                    {sphereActionState === 'sent' && (
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Text Dispatched! Simulated Client Reply (3 mins later):
                        </div>
                        <p className="text-sm text-white italic">
                          "{currentSphereContact.clientReply}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-2">
                      {sphereActionState !== 'sent' ? (
                        <>
                          <button
                            onClick={() => handleSphereDecision('skip')}
                            className="w-1/3 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>SKIP</span>
                          </button>
                          <button
                            onClick={() => handleSphereDecision('yes')}
                            className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>YES — Send Casual Check-In Text</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleNextSphereCard}
                          className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 border border-emerald-500/30 transition-all cursor-pointer"
                        >
                          <span>Load Next Past Client Match</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. THE BROKERAGE DIGITAL POD ARCHITECTURE */}
      <section id="pod-architecture" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" /> Under the Hood: Hybrid Go + Gemini ADK Pipeline
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            The Brokerage Digital Pod Architecture
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We separate deterministic high-speed RESO polling from multimodal AI reasoning—giving you sub-90-second launch velocity with zero rogue AI hallucinations. Click any component below to inspect its live payload:
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {ARCH_NODES.map((node) => {
            const IconComponent = node.icon;
            const isSelected = selectedArchNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedArchNode(node)}
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between relative cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 -translate-y-1'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-500 font-bold">STAGE {node.step}</span>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <IconComponent className={`w-5 h-5 ${node.iconColor}`} />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-white mb-1.5">{node.title}</h3>
                  <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded border mb-3 ${node.badgeColor}`}>
                    {node.type}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span>Inspect Node</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-emerald-400' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    STAGE {selectedArchNode.step} INSPECTOR
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">{selectedArchNode.title}</h4>
                </div>
                <span className="text-xs font-mono text-cyan-400">{selectedArchNode.latency}</span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                {selectedArchNode.summary}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <button
                  onClick={() => handleRunArchNodeProbe(selectedArchNode)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Execute Node via AG-UI Stream</span>
                </button>
                <button
                  onClick={() => setIsInspectorOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Telemetry Inspector</span>
                </button>
              </div>

              <div className="mb-4">
                <div className="text-xs font-mono uppercase text-slate-400 mb-2">Sample Event Payload / Output Contract:</div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                  {selectedArchNode.payload}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 mr-2">Included in Tiers:</span>
              {selectedArchNode.tiers.map((t, idx) => (
                <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-white border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 rounded-3xl border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                The "Human-in-the-Loop" Compliance Gate
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Real estate licenses and brokerage reputations are too valuable for unmonitored bots. Every post, MLS remark, and past-client check-in stages in a <strong className="text-emerald-300">pending_approval</strong> queue first.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 pt-4 border-t border-emerald-500/20">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click SMS or Dashboard Sign-Off</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fair Housing &amp; MLS IDX Guardrails</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Public Model Training on Client CRM Data</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE COMMISSION & ROI CALCULATOR */}
      <section id="roi-calculator" className="py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sliders className="w-3.5 h-3.5" /> Interactive Pipeline Estimator
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Calculate Your Annual Commission Lift
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Likes don't pay your bills—conversations and appointments do. Adjust the sliders below to match your current real estate activity:
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-6 space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" /> Weekly Car Voice Notes Sent
                  </label>
                  <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                    {weeklyVoiceNotes} / week
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={weeklyVoiceNotes}
                  onChange={(e) => setWeeklyVoiceNotes(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>1 note/wk (Casual)</span>
                  <span>7 notes/wk (Daily Driver)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" /> Past Clients &amp; Sphere Contacts in Phone
                  </label>
                  <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded">
                    {sphereContacts} contacts
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={sphereContacts}
                  onChange={(e) => setSphereContacts(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>50 contacts (New Agent)</span>
                  <span>500 contacts (Established)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" /> Monthly Active Listings (0 = Uses MLS Deal Finder)
                  </label>
                  <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded">
                    {monthlyListings} listings/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={monthlyListings}
                  onChange={(e) => setMonthlyListings(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>0 listings (Indie Agent)</span>
                  <span>15 listings/mo (Boutique Team)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Average Commission Per Closed Deal
                  </label>
                  <span className="text-sm font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded">
                    ${avgCommission.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="25000"
                  step="500"
                  value={avgCommission}
                  onChange={(e) => setAvgCommission(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>$5,000</span>
                  <span>$25,000</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Auto-DM Conversations</div>
                  <div className="text-3xl font-extrabold text-cyan-400">{monthlyDmConversations}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">From keyword triggers</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Sphere Revival Touches</div>
                  <div className="text-3xl font-extrabold text-amber-400">{monthlySphereTouches}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">1-to-1 comp check-ins</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1">Est. Booked Showings</div>
                  <div className="text-3xl font-extrabold text-emerald-400">{monthlyBookedShowings}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">Calendar-confirmed</div>
                </div>
              </div>

              <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-slate-900 border border-emerald-500/40 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                      PROJECTED ANNUALIZED COMMISSION PIPELINE
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                      ${projectedAnnualPipeline.toLocaleString()}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2">
                      Based on ~<strong>{estimatedAnnualClosings} incremental closed transactions/yr</strong> from automated DM speed-to-lead &amp; sphere comp alerts.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-emerald-200">
                    1 single closing pays for your PropSocial Pod for <strong>over 4 years</strong>.
                  </span>
                  <a 
                    href="#pricing-tiers"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider text-center transition-all"
                  >
                    Lock In My Territory
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THREE-TIER FUNNEL PRICING SECTION */}
      <section id="pricing-tiers" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" /> Scale From Solo Hustler to Dominant Brokerage
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Choose Your Digital Workforce Tier
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Start with our frictionless text-first Pocket Agent at $69/mo, or deploy the complete RESO MLS Launch &amp; Dispatch Pod for your team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Indie / Starter Agent
                </span>
                <span className="text-xs font-mono text-slate-400">0–1 Listings/mo</span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">"The Pocket Deal-Finder"</h3>
              <p className="text-xs text-slate-400 mb-6">
                For solo &amp; newer agents who want to generate leads from their car without learning complex dashboards.
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-800">
                <span className="text-4xl font-extrabold text-white">$69</span>
                <span className="text-sm text-slate-400">/month</span>
              </div>

              <div className="mb-6">
                <div className="text-xs font-mono uppercase text-slate-400 mb-2.5">Digital Teammates Included:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Pocket Deal-Finder
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Comment-to-DM Closer
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="text-xs font-mono uppercase text-slate-400">Core Deliverables:</div>
                {[
                  'Morning SMS/WhatsApp voice-note-to-post prompts',
                  'MLS "Deal of the Week" finder (even with 0 listings)',
                  'Automated IG/FB Comment-to-DM lead capture',
                  'Daily YES/SKIP past-client sphere revival game',
                  '1-click SMS approval before anything publishes'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleChooseTier('Indie / Starter Agent ($69/mo)')}
              className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <span>Start With Pocket Agent ($69)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 border-2 border-emerald-500 p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10 lg:-translate-y-3">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Solo / Top Producer
                </span>
                <span className="text-xs font-mono text-emerald-400">1–3 Listings/mo</span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">High-Volume Agent Pod</h3>
              <p className="text-xs text-slate-300 mb-6">
                Automated 90-second MLS listing launches, multimodal photo analysis, and automated showing coordination.
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-800">
                <span className="text-4xl font-extrabold text-white">$199</span>
                <span className="text-sm text-slate-400">/month</span>
              </div>

              <div className="mb-6">
                <div className="text-xs font-mono uppercase text-slate-400 mb-2.5">Digital Teammates Included:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Campaign Marketer
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Showing Coordinator
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                    + Full Pocket Deal-Finder Suite
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="text-xs font-mono uppercase text-emerald-400">Everything in Indie, plus:</div>
                {[
                  'Automated 90-sec MLS launch kit (remarks, social, email, SMS)',
                  'Gemini Vision listing photo inspection (auto-spots upgrades)',
                  'Automated tour confirmation polling & calendar routing',
                  'Price-improvement relaunch campaigns triggered automatically',
                  '1-click human-in-the-loop staging dashboard'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleChooseTier('Solo / Top Producer ($199/mo)')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <span>Deploy Solo Producer Pod ($199)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Boutique Team
                </span>
                <span className="text-xs font-mono text-slate-400">4–15 Producing Agents</span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">Full Brokerage Pod</h3>
              <p className="text-xs text-slate-400 mb-6">
                Complete RESO dispatch automation, CRM round-robin lead webhooks, and Pocket Agents for your roster.
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-800">
                <span className="text-4xl font-extrabold text-white">$499</span>
                <span className="text-sm text-slate-400">/month</span>
              </div>

              <div className="mb-6">
                <div className="text-xs font-mono uppercase text-slate-400 mb-2.5">Digital Teammates Included:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" /> MLS Dispatcher
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                    + Marketer + Coordinator + Team Pocket Agents
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="text-xs font-mono uppercase text-slate-400">Everything in Solo Producer, plus:</div>
                {[
                  'Real-time RESO MLS status & price dispatch alerts',
                  'Follow Up Boss, kvCORE & Lofty live webhook integrations',
                  'Automated team round-robin lead & showing routing',
                  'Centralized brokerage brand voice & compliance guardrails',
                  'Dedicated onboarding & custom MLS board mapping'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleChooseTier('Boutique Team ($499/mo)')}
              className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <span>Deploy Boutique Team Pod ($499)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. LEAD CAPTURE & ONBOARDING */}
      <section id="onboarding-funnel" className="py-24 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden grid md:grid-cols-12">
            <div className="md:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-6">
                  <PhoneCall className="w-3.5 h-3.5" /> Instant Live SMS Demo
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  Get a Live Test Text From Your Pocket Agent in 30 Seconds.
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-8">
                  Select your tier and enter your mobile number. Our Pocket Deal-Finder will immediately text you a sample MLS "Deal of the Week" for your market so you can experience the 1-click workflow right on your phone.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">48-Hour RESO MLS Activation</div>
                      <div className="text-xs text-slate-400">We handle all OData/IDX tokens and webhook plumbing.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">100% Human-Approved</div>
                      <div className="text-xs text-slate-400">Zero automated public posts or client texts without your YES.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">30-Day Appointment Guarantee</div>
                      <div className="text-xs text-slate-400">Book at least 3 qualified conversations in 30 days or don't pay.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-800/80 text-xs text-slate-400">
                Powered by Google ADK + Gemini 2.5 Multimodal &amp; RESO Web API Standards.
              </div>
            </div>

            <div className="md:col-span-7 p-8 sm:p-10">
              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">Activate Your Digital Workforce</h4>
                    <p className="text-xs sm:text-sm text-slate-400">No credit card required to test your live SMS agent demo.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      1. Selected Workforce Tier
                    </label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Indie / Starter Agent ($69/mo)">Indie / Starter Agent — $69/mo (Pocket Deal-Finder)</option>
                      <option value="Solo / Top Producer ($199/mo)">Solo / Top Producer — $199/mo (Marketer + Coordinator + Pocket)</option>
                      <option value="Boutique Team ($499/mo)">Boutique Team — $499/mo (Full Pod + MLS Dispatcher + CRM Webhooks)</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Mobile Number (For Live Test SMS) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(480) 555-0194"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@desertluxuryrealty.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Brokerage &amp; Primary Zip Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="Real Broker • 85296"
                        value={formData.brokerage}
                        onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.SendLiveTestText}
                      onChange={(e) => setFormData({ ...formData, SendLiveTestText: e.target.checked })}
                      className="mt-1 accent-emerald-400"
                    />
                    <span className="text-xs text-slate-300 leading-relaxed">
                      <strong>Send me an instant sample text right now:</strong> Have the Pocket Deal-Finder text my phone a simulated "Deal of the Week" &amp; voice-note prompt for my zip code.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Send My Live Test Text &amp; Reserve Pod</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="py-10 text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-white">
                    Pod Reserved! Check Your Phone ({formData.phone})
                  </h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    We just dispatched a live test prompt for <strong className="text-emerald-400">{formData.brokerage}</strong> under the <strong className="text-white">{selectedTier}</strong> plan. Reply with a 10-second voice note or tap <strong>YES</strong> on your phone to watch your AI teammate build your first post!
                  </p>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-left text-xs font-mono text-emerald-300 space-y-1">
                    <div>[STATUS]: TWILIO_SMS_DISPATCHED</div>
                    <div>[AGENT]: POCKET_DEAL_FINDER_V2.5</div>
                    <div>[HUMAN_APPROVAL_GATE]: ARMED</div>
                  </div>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs text-slate-400 hover:text-white underline pt-2 cursor-pointer"
                  >
                    Edit registration details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-300">PropSocial AI</span>
            <span>• Zero-Lag Real Estate Digital Workforce</span>
          </div>
          <div>
            © {new Date().getFullYear()} PropSocial AI. RESO Web API Compatible • Human-in-the-Loop Guaranteed.
          </div>
        </div>
      </footer>

      {/* AG-UI Telemetry Inspector Drawer */}
      <AgUiInspector
        stream={agUi}
        isOpen={isInspectorOpen}
        onToggle={() => setIsInspectorOpen(!isInspectorOpen)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
}
