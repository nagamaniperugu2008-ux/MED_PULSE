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
  const [currentRing, se