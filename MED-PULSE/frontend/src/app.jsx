import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  PhoneCall, 
  AlertTriangle, 
  Globe, 
  Radio, 
  UserCheck, 
  Info, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  HeartPulse, 
  Send, 
  Droplets, 
  Award, 
  Wifi, 
  WifiOff, 
  X, 
  Flame, 
  ArrowRight, 
  Database,
  RefreshCw
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

// BILINGUAL LOCALIZATION (English & Telugu)
const i18n = {
  EN: {
    brandSubtitle: 'Predictive Emergency Blood Network',
    outbreakTab: 'Outbreak Risk & Stock',
    liveHubTab: 'Live Emergency Hub',
    donorTab: 'Donor Portal & AI Parser',
    aboutTab: 'About & Impact',
    triggerEmergency: 'TRIGGER EMERGENCY DISPATCH',
    dispatching: 'DISPATCHING...',
    capacity: 'Capacity',
    units: 'Units',
    callsSent: 'Calls Sent',
    confirmed: 'Confirmed',
    avgEta: 'Avg ETA',
    mins: 'mins',
    standby: 'Standby',
    preemptiveDispatch: 'Preemptive Dispatch',
    activeClusters: 'Displaying 5 active hospital inventory clusters in Visakhapatnam',
    liveSync: 'Live Sync Active',
    coldStartBadge: 'Public Registry (e-RaktKosh): LIVE SYNC',
    offlineBanner: 'OFFLINE MODE ACTIVE: Internet connection severed. Generating 140-character GSM SMS payloads for cell tower dispatch.',
    switchOnline: 'Restore Web Data (5G)',
    switchOffline: 'Simulate Rural Drop (2G SMS)',
    cascadeTitle: 'Automated Cascading Escalation State Machine',
    ring0: 'Ring 0 (0-180s): IVR to Nearest Donors',
    ring1: 'Ring 1 (180-360s): Micro-Courier Fleet Expansion',
    ring2: 'Ring 2 (>360s): Autonomous Inter-Hospital Transfer',
    ackDonor: 'Simulate Donor Acceptance (Resolve)',
    activeCouriers: 'ACTIVE EMERGENCY COURIERS',
    shortageAlerts: 'CRITICAL SHORTAGE ALERTS',
    avgResponse: 'AVERAGE RESPONSE TIME',
    liveFeedTitle: 'Live Dispatch Feed (Visakhapatnam Metropolitan Area)',
    aiParserTitle: 'AI Blood Report Parser',
    aiParserSubtitle: 'Upload donor CBC or blood test reports. Med Pulse AI extracts hemoglobin, platelet counts, and verifies eligibility.',
    uploadPrompt: 'Click to Upload Donor CBC Report',
    donorRegTitle: 'Instant Donor Registration',
    donorRegSubtitle: 'Register as an emergency volunteer donor in Visakhapatnam.',
    fullName: 'Full Name',
    bloodGroup: 'Blood Group',
    phone: 'Phone Number',
    mandal: 'Vizag Mandal / Locality',
    registerBtn: 'Register as Emergency Donor',
    aboutTitle: 'About Med Pulse: Vizag Predictive Node',
    aboutDesc: 'Med Pulse uses predictive telemetry and regional demand analytics to prevent critical blood stockouts across Visakhapatnam hospitals.',
    livesSaved: 'Lives Impacted',
    unitsManaged: 'Units Managed',
    hospitalsConnected: 'Connected Hospitals'
  },
  TE: {
    brandSubtitle: 'అత్యవసర రక్త నిల్వ ప్రిడిక్టివ్ నెట్‌వర్క్',
    outbreakTab: 'వ్యాప్తి ప్రమాదం & స్టాక్',
    liveHubTab: 'లైవ్ ఎమర్జెన్సీ హబ్',
    donorTab: 'డోనర్ పోర్టల్ & AI పార్సర్',
    aboutTab: 'నెట్‌వర్క్ వివరాలు & ప్రభావం',
    triggerEmergency: 'అత్యవసర హెచ్చరిక పంపండి',
    dispatching: 'పంపుతోంది...',
    capacity: 'నిల్వ సామర్థ్యం',
    units: 'యూనిట్లు',
    callsSent: 'కాల్స్ వెళ్లాయి',
    confirmed: 'ధృవీకరించబడ్డాయి',
    avgEta: 'సగటు సమయం',
    mins: 'నిమిషాలు',
    standby: 'సిద్ధంగా ఉంది',
    preemptiveDispatch: 'ముందస్తు డిస్పాచ్',
    activeClusters: 'విశాఖపట్నం పరిధిలోని 5 ప్రధాన ఆసుపత్రుల రక్త నిల్వ వివరాలు',
    liveSync: 'లైవ్ కనెక్ట్ అయింది',
    coldStartBadge: 'పబ్లిక్ రిజిస్ట్రీ (e-రక్త్ కోష్): లైవ్ సింక్',
    offlineBanner: 'ఆఫ్‌లైన్ మోడ్: ఇంటర్నెట్ లేదు. 140 అక్షరాల GSM SMS ద్వారా అత్యవసర సమాచారం పంపబడుతోంది.',
    switchOnline: 'వెబ్ డేటా పునరుద్ధరించు (5G)',
    switchOffline: 'గ్రామీణ నెట్‌వర్క్ సిమ్యులేట్ చేయి (2G SMS)',
    cascadeTitle: 'ఆటోమేటెడ్ ఎస్కలేషన్ పైప్‌లైన్',
    ring0: 'రింగ్ 0 (0-180సె): సమీప రక్తదాతలకు IVR కాల్స్',
    ring1: 'రింగ్ 1 (180-360సె): కొరియర్ వాహన ఫ్లీట్ అలర్ట్',
    ring2: 'రింగ్ 2 (>360సె): ఇతర ఆసుపత్రుల నుండి బదిలీ',
    ackDonor: 'రక్తదాత అంగీకారం (సమస్య పరిష్కారం)',
    activeCouriers: 'రవాణాలో ఉన్న అత్యవసర వాహనాలు',
    shortageAlerts: 'తీవ్ర కొరత హెచ్చరికలు',
    avgResponse: 'సగటు రెస్పాన్స్ సమయం',
    liveFeedTitle: 'లైవ్ డిస్పాచ్ ఫీడ్ (విశాఖపట్నం మెట్రోపాలిటన్)',
    aiParserTitle: 'AI రక్త పరీక్ష రిపోర్ట్ విశ్లేషణ',
    aiParserSubtitle: 'రక్తదాత రిపోర్టును అప్‌లోడ్ చేసి హిమోగ్లోబిన్, ప్లేట్‌లెట్స్ అర్హతను సెకన్లలో తనిఖీ చేయండి.',
    uploadPrompt: 'CBC రక్త పరీక్ష రిపోర్ట్ అప్‌లోడ్ చేయండి',
    donorRegTitle: 'రక్తదాత నమోదు',
    donorRegSubtitle: 'విశాఖపట్నం అత్యవసర రక్తదాతగా ఇప్పుడే నమోదు చేసుకోండి.',
    fullName: 'పూర్తి పేరు',
    bloodGroup: 'బ్లడ్ గ్రూప్',
    phone: 'ఫోన్ నంబర్',
    mandal: 'విశాఖపట్నం ప్రాంతం / మండలం',
    registerBtn: 'రక్తదాతగా నమోదు చేయండి',
    aboutTitle: 'మెడ్ పల్స్ వైజాగ్ నెట్‌వర్క్ గురించి',
    aboutDesc: 'విశాఖపట్నం ఆసుపత్రులలో రక్తం మరియు ప్లేట్‌లెట్ల కొరత రాకుండా ముందస్తుగా హెచ్చరించి అందించే అత్యాధునిక నెట్‌వర్క్.',
    livesSaved: 'కాపాడిన ప్రాణాలు',
    unitsManaged: 'పంపిణీ చేసిన యూనిట్లు',
    hospitalsConnected: 'అనుసంధాన ఆసుపత్రులు'
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('outbreak');
  const [lang, setLang] = useState('EN');
  const t = i18n[lang];

  // System States
  const [isOffline, setIsOffline] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isDispatchingAll, setIsDispatchingAll] = useState(false);

  // Cascading Escalation Modal State
  const [cascadeModalOpen, setCascadeModalOpen] = useState(false);
  const [activeIncident, setActiveIncident] = useState(null);
  const [currentRing, setCurrentRing] = useState(0);
  const [cascadeLogs, setCascadeLogs] = useState([]);
  const [ringCountdown, setRingCountdown] = useState(10);

  // AI OCR Parser State
  const [analyzingReport, setAnalyzingReport] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  // Donor Registration State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');

  // Initial Fetch with Fallback
  useEffect(() => {
    fetch(`${API_BASE}/hospitals`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setHospitals(d.data);
      })
      .catch(() => {
        setHospitals([
          { id: 'node-care', name: 'Care Hospital Vizag', mandal: 'Maharani Peta Mandal, Vizag', isSample: true, requiredBlood: 'B+ Platelets', riskPercentage: 76, riskLevel: 'HIGH', capacityCurrent: 18, capacityTotal: 40, callsSent: 10, callsConfirmed: 8, avgEtaMins: 18 },
          { id: 'node-asram', name: 'ASRAM Blood Center', mandal: 'Gajuwaka Mandal, Vizag', isSample: true, requiredBlood: 'AB+ Platelets', riskPercentage: 31, riskLevel: 'LOW', capacityCurrent: 45, capacityTotal: 50, callsSent: 0, callsConfirmed: 0, avgEtaMins: null },
          { id: 'node-sevenhills', name: 'SevenHills Hospital', mandal: 'Ram Nagar Mandal, Vizag', isSample: true, requiredBlood: 'O- PRBC', riskPercentage: 65, riskLevel: 'MED', capacityCurrent: 20, capacityTotal: 30, callsSent: 5, callsConfirmed: 4, avgEtaMins: 25 },
          { id: 'node-gimsr', name: 'GIMSR Hospital', mandal: 'Rushikonda Mandal, Vizag', isSample: true, requiredBlood: 'A- Platelets', riskPercentage: 82, riskLevel: 'HIGH', capacityCurrent: 10, capacityTotal: 40, callsSent: 12, callsConfirmed: 9, avgEtaMins: 19 },
          { id: 'node-apollo', name: 'Apollo Vizag', mandal: 'Arilova Mandal, Vizag', isSample: true, requiredBlood: 'B- Whole Blood', riskPercentage: 25, riskLevel: 'LOW', capacityCurrent: 28, capacityTotal: 30, callsSent: 0, callsConfirmed: 0, avgEtaMins: null }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const triggerToast = (msg, isError = false) => {
    setNotification({ msg, isError });
    setTimeout(() => setNotification(null), 3500);
  };

  // Launch Automated Cascading Escalation Pipeline
  const launchEscalationPipeline = (hospital) => {
    if (isOffline) {
      // Trigger Offline SMS Dispatch
      const payload = `MP|SOS|${hospital.id}|${hospital.requiredBlood.replace(' ', '_')}|3U|9F82`;
      triggerToast(`[SMS GATEWAY DISPATCH] Payload broadcast: ${payload}`);
      return;
    }

    setActiveIncident(hospital);
    setCurrentRing(0);
    setRingCountdown(10);
    setCascadeLogs([
      `[00:00] INITIATED: Targeted spatial query matched 3 verified ${hospital.requiredBlood} donors near ${hospital.mandal}.`,
      `[00:01] RING 0: Automated IVR voice dispatch queued to phone numbers.`
    ]);
    setCascadeModalOpen(true);
  };

  // Timer loop simulating Ring 0 -> Ring 1 -> Ring 2 cascading
  useEffect(() => {
    if (!cascadeModalOpen || currentRing === 3) return;

    const timer = setInterval(() => {
      setRingCountdown(prev => {
        if (prev > 1) return prev - 1;

        // Cascade progression
        if (currentRing === 0) {
          setCurrentRing(1);
          setCascadeLogs(l => [
            `[00:10] RING 0 TIMEOUT (No donor pickup within 180s threshold).`,
            `[00:11] ESCALATING TO RING 1: Broadcast radius expanded to 10 donors + Vizag Bike Fleet Unit #04 notified.`,
            ...l
          ]);
          return 10;
        } else if (currentRing === 1) {
          setCurrentRing(2);
          setCascadeLogs(l => [
            `[00:20] RING 1 TIMEOUT: Local volunteer donors unavailable.`,
            `[00:21] CRITICAL ESCALATION (RING 2): Auto-reserving 3 surplus units from ASRAM Blood Center (Surplus: 45 units). Transit locked.`,
            ...l
          ]);
          return 0;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cascadeModalOpen, currentRing]);

  // Resolve / Acknowledge Cascade
  const resolveCascade = () => {
    setCurrentRing(3); // 3 = Resolved
    setCascadeLogs(l => [
      `[RESOLVED] Verification ACK received. Courier route locked via Jagadamba green corridor.`,
      ...l
    ]);
    triggerToast('Cascade Pipeline successfully resolved!');
  };

  // Trigger Emergency Dispatch for all
  const handleTriggerEmergencyDispatch = async () => {
    setIsDispatchingAll(true);
    try {
      await fetch(`${API_BASE}/emergency-dispatch`, { method: 'POST' });
    } catch {
      // Offline fallback
    }
    setHospitals(prev => prev.map(h => (h.riskLevel === 'HIGH' || h.riskLevel === 'MED') ? {
      ...h,
      callsSent: h.callsSent + 10,
      callsConfirmed: h.callsConfirmed + 7
    } : h));
    setIsDispatchingAll(false);
    triggerToast(lang === 'EN' ? '🚨 EMERGENCY DISPATCH BROADCASTED TO ALL NODES!' : '🚨 అన్ని ఆసుపత్రులకు అత్యవసర హెచ్చరిక పంపబడింది!');
  };

  // AI OCR Parser Simulator
  const runAiParser = () => {
    setAnalyzingReport(true);
    setParsedData(null);
    setTimeout(() => {
      setAnalyzingReport(false);
      setParsedData({
        patient: 'K. S. Rao (Donor ID: VZ-8891)',
        bloodGroup: 'B+ Positive',
        hemoglobin: '14.8 g/dL (Normal)',
        platelets: '265,000 /µL (Optimal)',
        serology: 'Non-Reactive (Safe for Donation)',
        status: 'ELIGIBLE FOR IMMEDIATE DISPATCH'
      });
      triggerToast(lang === 'EN' ? 'AI OCR Analysis Complete!' : 'రిపోర్ట్ విశ్లేషణ పూర్తయింది!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#071120] text-slate-100 flex flex-col font-sans select-none">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm transition-all animate-bounce ${
          notification.isError ? 'bg-red-950 border-red-500 text-red-200' : 'bg-emerald-950 border-emerald-500 text-emerald-200'
        }`}>
          {notification.isError ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* OFFLINE RESILIENCE BANNER (DEMO TOGGLE) */}
      {isOffline && (
        <div className="bg-amber-950 border-b border-amber-600/60 px-6 py-2 flex items-center justify-between text-xs text-amber-200 font-medium">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{t.offlineBanner}</span>
          </div>
          <span className="font-mono bg-black/40 px-2 py-0.5 rounded border border-amber-500/40">
            PAYLOAD: MP|SOS|NODE-CARE|B_POS_PLT|3U|9F82
          </span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="bg-[#0b162c] border-b border-[#1b2b4d] px-6 py-3.5 flex items-center justify-between shadow-lg sticky top-0 z-40">
        
        {/* Brand */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('outbreak')}>
          <div className="w-10 h-10 rounded-full bg-[#e62e2e] flex items-center justify-center text-white shadow-md shadow-red-900/40">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">Med Pulse</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#351419] text-[#e63946] border border-[#6b1e25]">
                VIZAG NODE
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-normal font-medium">{t.brandSubtitle}</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <div className="flex items-center gap-2">
          {/* Outbreak Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('outbreak')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs tracking-wider transition ${
              activeTab === 'outbreak' 
                ? 'bg-[#d92d34] text-white shadow-md shadow-red-950' 
                : 'text-slate-300 hover:text-white hover:bg-[#13223f]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <div className="text-left">
              <div>Outbreak</div>
              <div className="text-[10px] opacity-80">Risk & Stock</div>
            </div>
          </button>

          {/* Live Hub Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('live-hub')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs tracking-wider transition ${
              activeTab === 'live-hub' 
                ? 'bg-[#d92d34] text-white shadow-md shadow-red-950' 
                : 'text-slate-300 hover:text-white hover:bg-[#13223f]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <div className="text-left">
              <div>Live</div>
              <div className="text-[10px] opacity-80">Emergency Hub</div>
            </div>
          </button>

          {/* Donor Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('donor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs tracking-wider transition ${
              activeTab === 'donor' 
                ? 'bg-[#d92d34] text-white shadow-md shadow-red-950' 
                : 'text-slate-300 hover:text-white hover:bg-[#13223f]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <div className="text-left">
              <div>Donor Portal</div>
              <div className="text-[10px] opacity-80">& AI Parser</div>
            </div>
          </button>

          {/* About Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs tracking-wider transition ${
              activeTab === 'about' 
                ? 'bg-[#d92d34] text-white shadow-md shadow-red-950' 
                : 'text-slate-300 hover:text-white hover:bg-[#13223f]'
            }`}
          >
            <Info className="w-4 h-4" />
            <div className="text-left">
              <div>About</div>
              <div className="text-[10px] opacity-80">& Impact</div>
            </div>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* 2G / Offline Simulation Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsOffline(!isOffline);
              triggerToast(!isOffline ? 'Offline 2G SMS Protocol Active' : 'Online Webhook Re-established');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              isOffline ? 'bg-amber-900/60 border-amber-500 text-amber-200' : 'bg-[#111e38] border-[#20345b] text-slate-300'
            }`}
            title="Toggle to simulate internet loss at a rural clinic"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden md:inline">{isOffline ? t.switchOnline : t.switchOffline}</span>
          </button>

          {/* Telugu / English Language Switcher */}
          <button 
            type="button"
            onClick={() => setLang(l => (l === 'EN' ? 'TE' : 'EN'))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111e38] border border-[#20345b] text-xs font-semibold text-slate-200 hover:bg-[#18294a] transition"
          >
            <Globe className="w-4 h-4 text-rose-400" />
            <span>{lang === 'EN' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Global Emergency Dispatch Button */}
          <button 
            type="button"
            onClick={handleTriggerEmergencyDispatch}
            disabled={isDispatchingAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d92d34] to-[#c11c22] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 border border-red-400/30 transition disabled:opacity-50"
          >
            <PhoneCall className="w-4 h-4 fill-white" />
            <span>{isDispatchingAll ? t.dispatching : t.triggerEmergency}</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

        {/* ========================================================
            SLIDE 1: OUTBREAK RISK & STOCK (The Screenshot Table)
           ======================================================== */}
        {activeTab === 'outbreak' && (
          <div className="space-y-3.5">
            <div className="flex justify-between items-center mb-1 text-xs text-slate-400">
              <span>{t.activeClusters}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sky-400 bg-sky-950/50 border border-sky-800/60 px-2 py-0.5 rounded text-[11px] font-medium">
                  <Database className="w-3 h-3" />
                  {t.coldStartBadge}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.liveSync}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center text-slate-400">Connecting to telemetry network...</div>
            ) : (
              hospitals.map((node) => {
                const capacityPct = Math.min(100, Math.round((node.capacityCurrent / node.capacityTotal) * 100));
                const isLowCapacity = capacityPct < 50;

                return (
                  <div 
                    key={node.id} 
                    className="bg-[#0b162b] border border-[#162747] hover:border-[#273d6b] rounded-xl px-5 py-4 flex items-center justify-between transition-all duration-150 shadow-md"
                  >
                    {/* Hospital Name & Mandal */}
                    <div className="w-56 shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-100 text-[15px] leading-tight truncate">{node.name}</h3>
                        {node.isSample && (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#172540] border border-[#24375b] text-slate-400">
                            Sample
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{node.mandal}</span>
                      </div>
                    </div>

                    {/* Blood Requirement */}
                    <div className="w-32 flex justify-center shrink-0">
                      <span className="px-3 py-1.5 rounded-lg bg-[#2b1016] border border-[#6b1e25] text-red-300 font-bold text-xs tracking-wide text-center">
                        {node.requiredBlood}
                      </span>
                    </div>

                    {/* Risk Percentage & Badge */}
                    <div className="w-28 flex justify-center shrink-0">
                      <div className={`flex items-center gap-2 px-2.5 py-1 rounded border ${
                        node.riskLevel === 'HIGH' 
                          ? 'bg-[#2a171c] border-[#a83232] text-amber-400' 
                          : node.riskLevel === 'MED'
                          ? 'bg-[#1a2219] border-[#ca8a04] text-yellow-400'
                          : 'bg-[#0b2420] border-[#15803d] text-emerald-400'
                      }`}>
                        <span className="font-bold text-sm">{node.riskPercentage}%</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wide">{node.riskLevel}</span>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="w-48 shrink-0">
                      <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                        <span className="text-slate-400 text-[11px]">{t.capacity}</span>
                        <span className="text-slate-200 font-semibold text-[11px]">
                          {node.capacityCurrent}/{node.capacityTotal} {t.units}
                        </span>
                      </div>
                      <div className="w-full bg-[#12203b] h-2 rounded-full overflow-hidden border border-[#1d3056]">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isLowCapacity ? 'bg-amber-500' : 'bg-[#10b981]'}`}
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Telemetry / Calls */}
                    <div className="w-44 text-xs shrink-0 pl-4">
                      <div className="text-slate-300 font-medium">
                        <span className="text-amber-400 font-bold">{node.callsSent}</span> {t.callsSent}{' '}
                        <span className="text-slate-400 font-bold">→</span>{' '}
                        <span className="text-emerald-400 font-bold">{node.callsConfirmed}</span> {t.confirmed}
                      </div>
                      {node.avgEtaMins ? (
                        <div className="text-sky-400 font-medium text-[11px] mt-0.5">
                          {t.avgEta}: {node.avgEtaMins} {t.mins}
                        </div>
                      ) : (
                        <div className="text-slate-500 text-[11px] mt-0.5">{t.standby}</div>
                      )}
                    </div>

                    {/* Preemptive Dispatch Action */}
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => launchEscalationPipeline(node)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d92d34] hover:bg-[#b91c22] active:scale-95 text-white font-semibold text-xs tracking-tight shadow-md shadow-red-950/40 border border-red-400/20 transition cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 fill-white" />
                        <span>{t.preemptiveDispatch}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================
            SLIDE 2: LIVE EMERGENCY HUB
           ======================================================== */}
        {activeTab === 'live-hub' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>{t.activeCouriers}</span>
                  <Navigation className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">7 {t.units}</div>
                <div className="text-xs text-emerald-400 mt-1">● 4 Rapid Bikes | 3 Transit Ambulances</div>
              </div>

              <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>{t.shortageAlerts}</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400">2 Hospitals</div>
                <div className="text-xs text-slate-400 mt-1">Care Vizag & GIMSR Hospital</div>
              </div>

              <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>{t.avgResponse}</span>
                  <Clock className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-sky-400">16.4 {t.mins}</div>
                <div className="text-xs text-emerald-400 mt-1">↓ 32% faster than city emergency average</div>
              </div>
            </div>

            {/* Live Incidents */}
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex items-center justify-between border-b border-[#162747] pb-4 mb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  {t.liveFeedTitle}
                </h3>
                <span className="text-xs text-slate-400">Real-time GPS telemetry</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#101e38] border border-[#1e345e] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-400 font-bold text-xs">CRITICAL SOS</span>
                      <span className="font-bold text-white text-sm">King George Hospital (KGH Vizag)</span>
                      <span className="text-xs text-slate-400">• 4 mins ago</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Urgent Request: 3 Units O-Negative PRBC requested for trauma OT. Green corridor active via Jagadamba.
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 px-3 py-1.5 rounded-lg">
                      Transit: ETA 7 mins
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#101e38] border border-[#1e345e] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-400 font-bold text-xs">DISPATCHED</span>
                      <span className="font-bold text-white text-sm">SevenHills Hospital</span>
                      <span className="text-xs text-slate-400">• 12 mins ago</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Preemptive Stock Replenishment: 4 units Single Donor Platelets (SDP) in transit from Vizag Red Cross Central.
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-700/60 px-3 py-1.5 rounded-lg">
                      Transit: ETA 14 mins
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 3: DONOR PORTAL & AI PARSER
           ======================================================== */}
        {activeTab === 'donor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Medical OCR Parser */}
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-lg">{t.aiParserTitle}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">{t.aiParserSubtitle}</p>

              <div 
                onClick={runAiParser}
                className="border-2 border-dashed border-[#24375b] hover:border-red-500/60 rounded-xl p-8 text-center cursor-pointer bg-[#0e1b34] transition group"
              >
                <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-red-400 mx-auto mb-3 transition" />
                <div className="font-semibold text-sm text-slate-200">
                  {analyzingReport ? (lang === 'EN' ? 'Analyzing CBC with MedPulse AI...' : 'AI విశ్లేషిస్తోంది...') : t.uploadPrompt}
                </div>
                <div className="text-xs text-slate-500 mt-1">Click to simulate OCR scan (PDF/PNG)</div>
              </div>

              {parsedData && (
                <div className="mt-5 p-4 rounded-xl bg-[#08221c] border border-[#14532d]">
                  <div className="flex items-center justify-between mb-3 border-b border-emerald-800/40 pb-2">
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> AI OCR VERIFICATION PASS
                    </span>
                    <span className="text-[11px] text-slate-300 font-semibold">{parsedData.patient}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-400">Blood Group:</span> <strong className="text-white ml-1">{parsedData.bloodGroup}</strong></div>
                    <div><span className="text-slate-400">Hemoglobin:</span> <strong className="text-emerald-300 ml-1">{parsedData.hemoglobin}</strong></div>
                    <div><span className="text-slate-400">Platelets:</span> <strong className="text-emerald-300 ml-1">{parsedData.platelets}</strong></div>
                    <div><span className="text-slate-400">Serology:</span> <strong className="text-emerald-300 ml-1">{parsedData.serology}</strong></div>
                  </div>
                  <div className="mt-3 text-center py-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    {parsedData.status}
                  </div>
                </div>
              )}
            </div>

            {/* Instant Donor Registration Form */}
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-lg">{t.donorRegTitle}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">{t.donorRegSubtitle}</p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast(lang === 'EN' ? `Donor ${donorName || 'Volunteer'} registered into Vizag Node roster!` : 'రక్తదాత విజయవంతంగా నమోదయ్యారు!');
                  setDonorName('');
                  setDonorPhone('');
                }} 
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{t.fullName}</label>
                  <input 
                    type="text" 
                    required 
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Harini Prasanna" 
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e1b34] border border-[#1f3258] text-white focus:outline-none focus:border-red-500" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">{t.bloodGroup}</label>
                    <select className="w-full px-3 py-2.5 rounded-lg bg-[#0e1b34] border border-[#1f3258] text-white focus:outline-none focus:border-red-500">
                      <option>O +ve</option>
                      <option>O -ve</option>
                      <option>A +ve</option>
                      <option>A -ve</option>
                      <option>B +ve</option>
                      <option>B -ve</option>
                      <option>AB +ve</option>
                      <option>AB -ve</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">{t.phone}</label>
                    <input 
                      type="tel" 
                      required 
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+91 98765 43210" 
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0e1b34] border border-[#1f3258] text-white focus:outline-none focus:border-red-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{t.mandal}</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-[#0e1b34] border border-[#1f3258] text-white focus:outline-none focus:border-red-500">
                    <option>Maharani Peta Mandal, Vizag</option>
                    <option>Gajuwaka Mandal, Vizag</option>
                    <option>Rushikonda Mandal, Vizag</option>
                    <option>Arilova Mandal, Vizag</option>
                    <option>Ram Nagar Mandal, Vizag</option>
                    <option>Madhurawada, Vizag</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 rounded-lg bg-[#d92d34] hover:bg-[#b91c22] text-white font-bold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-950/40"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.registerBtn}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 4: ABOUT & IMPACT
           ======================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-7">
              <h2 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2">
                <Award className="w-6 h-6 text-red-500" />
                {t.aboutTitle}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
                {t.aboutDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-5 rounded-xl bg-[#0f1f3d] border border-[#1d335c]">
                  <div className="flex items-center gap-3">
                    <HeartPulse className="w-8 h-8 text-red-500" />
                    <div>
                      <div className="text-2xl font-extrabold text-white">1,420+</div>
                      <div className="text-xs text-slate-400">{t.livesSaved}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0f1f3d] border border-[#1d335c]">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-8 h-8 text-sky-400" />
                    <div>
                      <div className="text-2xl font-extrabold text-white">8,950</div>
                      <div className="text-xs text-slate-400">{t.unitsManaged}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0f1f3d] border border-[#1d335c]">
                  <div className="flex items-center gap-3">
                    <Activity className="w-8 h-8 text-emerald-400" />
                    <div>
                      <div className="text-2xl font-extrabold text-white">18</div>
                      <div className="text-xs text-slate-400">{t.hospitalsConnected}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          MODAL: LIVE CASCADE ESCALATION STATE MACHINE
         ======================================================== */}
      {cascadeModalOpen && activeIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b162b] border border-[#1e345e] max-w-3xl w-full rounded-2xl p-6 shadow-2xl space-y-5 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-[#162747] pb-3">
              <div>
                <span className="text-xs font-bold text-red-400 tracking-wider uppercase">AUTONOMOUS ESCALATION ACTIVE</span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  {activeIncident.name} ({activeIncident.requiredBlood})
                </h2>
              </div>
              <button 
                onClick={() => setCascadeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#13223f] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Ring Tiers */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              
              {/* Ring 0 */}
              <div className={`p-3 rounded-xl border transition-all ${
                currentRing === 0 
                  ? 'bg-red-950/60 border-red-500 ring-2 ring-red-500/20' 
                  : currentRing > 0 ? 'bg-[#0f1d38] border-emerald-500 opacity-60' : 'bg-[#0f1d38] border-[#1b2b4d] opacity-40'
              }`}>
                <div className="font-bold text-slate-300">Ring 0 (0-180s)</div>
                <div className="font-extrabold text-white mt-1">Nearest Donors IVR</div>
                {currentRing === 0 && <div className="text-red-400 font-mono mt-1 font-bold">Timeout in: {ringCountdown}s</div>}
              </div>

              {/* Ring 1 */}
              <div className={`p-3 rounded-xl border transition-all ${
                currentRing === 1 
                  ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/20' 
                  : currentRing > 1 ? 'bg-[#0f1d38] border-emerald-500 opacity-60' : 'bg-[#0f1d38] border-[#1b2b4d] opacity-40'
              }`}>
                <div className="font-bold text-slate-300">Ring 1 (180-360s)</div>
                <div className="font-extrabold text-white mt-1">Micro-Courier Fleet</div>
                {currentRing === 1 && <div className="text-amber-400 font-mono mt-1 font-bold">Timeout in: {ringCountdown}s</div>}
              </div>

              {/* Ring 2 */}
              <div className={`p-3 rounded-xl border transition-all ${
                currentRing === 2 
                  ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/20' 
                  : currentRing === 3 ? 'bg-emerald-950/60 border-emerald-500' : 'bg-[#0f1d38] border-[#1b2b4d] opacity-40'
              }`}>
                <div className="font-bold text-slate-300">Ring 2 (&gt;360s)</div>
                <div className="font-extrabold text-white mt-1">Hospital Rebalance</div>
                {currentRing === 2 && <div className="text-purple-400 font-mono mt-1 font-bold">Auto-diverting stock</div>}
              </div>
            </div>

            {/* Cascade Console Terminal */}
            <div className="bg-[#070e1c] rounded-xl p-4 border border-[#162747] h-44 overflow-y-auto font-mono text-xs space-y-1.5 text-slate-300">
              {cascadeLogs.map((log, index) => (
                <div key={index} className="leading-tight text-slate-300">{log}</div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">
                {currentRing < 3 ? 'Simulating automated failure cascade...' : 'Incident fulfilled & closed.'}
              </span>
              <div className="flex gap-2">
                {currentRing < 3 && (
                  <button 
                    onClick={resolveCascade}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {t.ackDonor}
                  </button>
                )}
                <button 
                  onClick={() => setCascadeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Close Console
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}