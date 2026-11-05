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
  Send
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('outbreak');
  const [lang, setLang] = useState('EN'); // EN or TE
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isDispatchingAll, setIsDispatchingAll] = useState(false);

  // AI Parser state
  const [analyzingReport, setAnalyzingReport] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  // Fetch Hospitals from API (with fallback if backend isn't booted yet)
  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${API_BASE}/hospitals`);
      const data = await res.json();
      if (data.success) {
        setHospitals(data.data);
      }
    } catch {
      // Fallback data matching the screenshot if backend is offline
      setHospitals([
        { id: 'node-care', name: 'Care Hospital Vizag', mandal: 'Maharani Peta Mandal, Vizag', isSample: true, requiredBlood: 'B+ Platelets', riskPercentage: 76, riskLevel: 'HIGH', capacityCurrent: 18, capacityTotal: 40, callsSent: 10, callsConfirmed: 8, avgEtaMins: 18 },
        { id: 'node-asram', name: 'ASRAM Blood Center', mandal: 'Gajuwaka Mandal, Vizag', isSample: true, requiredBlood: 'AB+ Platelets', riskPercentage: 31, riskLevel: 'LOW', capacityCurrent: 45, capacityTotal: 50, callsSent: 0, callsConfirmed: 0, avgEtaMins: null },
        { id: 'node-sevenhills', name: 'SevenHills Hospital', mandal: 'Ram Nagar Mandal, Vizag', isSample: true, requiredBlood: 'O- PRBC', riskPercentage: 65, riskLevel: 'MED', capacityCurrent: 20, capacityTotal: 30, callsSent: 5, callsConfirmed: 4, avgEtaMins: 25 },
        { id: 'node-gimsr', name: 'GIMSR Hospital', mandal: 'Rushikonda Mandal, Vizag', isSample: true, requiredBlood: 'A- Platelets', riskPercentage: 82, riskLevel: 'HIGH', capacityCurrent: 10, capacityTotal: 40, callsSent: 12, callsConfirmed: 9, avgEtaMins: 19 },
        { id: 'node-apollo', name: 'Apollo Vizag', mandal: 'Arilova Mandal, Vizag', isSample: true, requiredBlood: 'B- Whole Blood', riskPercentage: 25, riskLevel: 'LOW', capacityCurrent: 28, capacityTotal: 30, callsSent: 0, callsConfirmed: 0, avgEtaMins: null }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const triggerToast = (msg, isError = false) => {
    setNotification({ msg, isError });
    setTimeout(() => setNotification(null), 3500);
  };

  // Preemptive Dispatch handler
  const handlePreemptiveDispatch = async (id, name) => {
    try {
      const res = await fetch(`${API_BASE}/dispatch/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setHospitals(prev => prev.map(h => h.id === id ? data.updatedNode : h));
        triggerToast(`Outreach initiated for ${name}`);
        return;
      }
    } catch {
      // Local state update fallback
      setHospitals(prev => prev.map(h => h.id === id ? {
        ...h,
        callsSent: h.callsSent + 5,
        callsConfirmed: h.callsConfirmed + 3,
        avgEtaMins: h.avgEtaMins ? Math.max(12, h.avgEtaMins - 2) : 22
      } : h));
      triggerToast(`Outreach initiated for ${name} (Offline mode)`);
    }
  };

  // Global Emergency Dispatch
  const handleTriggerEmergencyDispatch = async () => {
    setIsDispatchingAll(true);
    try {
      await fetch(`${API_BASE}/emergency-dispatch`, { method: 'POST' });
    } catch {
      // Ignore API err in offline mode
    }
    setHospitals(prev => prev.map(h => (h.riskLevel === 'HIGH' || h.riskLevel === 'MED') ? {
      ...h,
      callsSent: h.callsSent + 10,
      callsConfirmed: h.callsConfirmed + 7
    } : h));
    setIsDispatchingAll(false);
    triggerToast('🚨 EMERGENCY BROADCAST SENT TO ALL VIZAG NODES!');
  };

  // Simulate AI OCR Parser
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
        hepatitis_hiv: 'Non-Reactive (Safe)',
        status: 'ELIGIBLE FOR IMMEDIATE DISPATCH'
      });
      triggerToast('AI Report Analysis Complete!');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#071120] text-slate-100 flex flex-col font-sans select-none">
      {/* Toast Alert */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border text-sm transition-all duration-300 ${
          notification.isError ? 'bg-red-950 border-red-500 text-red-200' : 'bg-emerald-950 border-emerald-500 text-emerald-200'
        }`}>
          {notification.isError ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{notification.msg}</span>
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
            <p className="text-xs text-slate-400 tracking-normal font-medium">
              {lang === 'EN' ? 'Predictive Emergency Blood Network' : 'అత్యవసర రక్త సరఫరా నెట్‌వర్క్'}
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <div className="flex items-center gap-2">
          {/* Tab 1 */}
          <button 
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

          {/* Tab 2 */}
          <button 
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

          {/* Tab 3 */}
          <button 
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

          {/* Tab 4 */}
          <button 
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

        {/* Right Action / Language Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(l => l === 'EN' ? 'TE' : 'EN')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111e38] border border-[#20345b] text-xs font-semibold text-slate-200 hover:bg-[#18294a] transition"
          >
            <Globe className="w-4 h-4 text-rose-400" />
            <span>{lang === 'EN' ? 'తెలుగు' : 'English'}</span>
          </button>

          <button 
            onClick={handleTriggerEmergencyDispatch}
            disabled={isDispatchingAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d92d34] to-[#c11c22] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 border border-red-400/30 transition disabled:opacity-50"
          >
            <PhoneCall className="w-4 h-4 fill-white" />
            <span>{isDispatchingAll ? 'BROADCASTING...' : 'TRIGGER EMERGENCY DISPATCH'}</span>
          </button>
        </div>
      </header>

      {/* DYNAMIC MAIN CONTENT SLIDES */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full transition-all">
        
        {/* ========================================================
            SLIDE 1: OUTBREAK RISK & STOCK (Original Image View)
           ======================================================== */}
        {activeTab === 'outbreak' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="flex justify-between items-center mb-1 text-xs text-slate-400">
              <span>Displaying 5 active hospital inventory clusters in Visakhapatnam</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Sync Active
              </span>
            </div>

            {loading ? (
              <div className="py-24 text-center text-slate-400">Loading Node Telemetry...</div>
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
                        <span className="text-slate-400 text-[11px]">Capacity</span>
                        <span className="text-slate-200 font-semibold text-[11px]">
                          {node.capacityCurrent}/{node.capacityTotal} Units
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
                        <span className="text-amber-400 font-bold">{node.callsSent}</span> Calls Sent{' '}
                        <span className="text-slate-400 font-bold">→</span>{' '}
                        <span className="text-emerald-400 font-bold">{node.callsConfirmed}</span> Confirmed
                      </div>
                      {node.avgEtaMins ? (
                        <div className="text-sky-400 font-medium text-[11px] mt-0.5">
                          Avg ETA: {node.avgEtaMins} mins
                        </div>
                      ) : (
                        <div className="text-slate-500 text-[11px] mt-0.5">Standby</div>
                      )}
                    </div>

                    {/* Dispatch Button */}
                    <div className="shrink-0">
                      <button
                        onClick={() => handlePreemptiveDispatch(node.id, node.name)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d92d34] hover:bg-[#b91c22] active:scale-95 text-white font-semibold text-xs tracking-tight shadow-md shadow-red-950/40 border border-red-400/20 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5 fill-white" />
                        <span>Preemptive Dispatch</span>
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
          <div className="space-y-6 animate-fadeIn">
            {/* Header Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>ACTIVE EMERGENCY COURIERS</span>
                  <Navigation className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">7 Units</div>
                <div className="text-xs text-emerald-400 mt-1">● 4 Bike Couriers | 3 Ambulances</div>
              </div>

              <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>CRITICAL SHORTAGE ALERTS</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400">2 Hospitals</div>
                <div className="text-xs text-slate-400 mt-1">Care Vizag & GIMSR Hospital</div>
              </div>

              <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>AVERAGE RESPONSE TIME</span>
                  <Clock className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-sky-400">16.4 Mins</div>
                <div className="text-xs text-emerald-400 mt-1">↓ 32% faster than city average</div>
              </div>
            </div>

            {/* Live Incidents Stream */}
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex items-center justify-between border-b border-[#162747] pb-4 mb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  Live Dispatch Feed (Visakhapatnam Metropolitan Area)
                </h3>
                <span className="text-xs text-slate-400">Auto-refreshing every 5 seconds</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#101e38] border border-[#1e345e] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-400 font-bold text-xs">CRITICAL SOS</span>
                      <span className="font-bold text-white text-sm">King George Hospital (KGH)</span>
                      <span className="text-xs text-slate-400">• 4 mins ago</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Urgent Request: 3 Units O-Negative PRBC requested for trauma unit. Green Corridor cleared on Jagadamba Junction.
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
                      Preemptive Stock replenishment: 4 units Single Donor Platelets (SDP) in transit from Vizag Red Cross Node.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* AI Medical Report Parser Card */}
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-lg">AI Blood Report Parser</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Upload donor CBC or blood test reports. Med Pulse AI extracts hemoglobin, platelet counts, and verifies donor eligibility in seconds.
              </p>

              {/* Upload Dropzone */}
              <div 
                onClick={runAiParser}
                className="border-2 border-dashed border-[#24375b] hover:border-red-500/60 rounded-xl p-8 text-center cursor-pointer bg-[#0e1b34] transition group"
              >
                <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-red-400 mx-auto mb-3 transition" />
                <div className="font-semibold text-sm text-slate-200">
                  {analyzingReport ? 'Analyzing report with MedPulse AI...' : 'Click to Upload Donor CBC Report'}
                </div>
                <div className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG (Max 10MB)</div>
              </div>

              {/* Parsed Result Display */}
              {parsedData && (
                <div className="mt-5 p-4 rounded-xl bg-[#08221c] border border-[#14532d] animate-fadeIn">
                  <div className="flex items-center justify-between mb-3 border-b border-emerald-800/40 pb-2">
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> AI OCR VERIFICATION PASS
                    </span>
                    <span className="text-[11px] text-slate-300 font-semibold">{parsedData.patient}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-400">Blood Group:</span> <strong className="text-white">{parsedData.bloodGroup}</strong></div>
                    <div><span className="text-slate-400">Hemoglobin:</span> <strong className="text-emerald-300">{parsedData.hemoglobin}</strong></div>
                    <div><span className="text-slate-400">Platelets:</span> <strong className="text-emerald-300">{parsedData.platelets}</strong></div>
                    <div><span className="text-slate-400">Serology:</span> <strong className="text-emerald-300">{parsedData.hepatitis_hiv}</strong></div>
                  </div>
                  <div className="mt-3 text-center py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    {parsedData.status}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Donor Registration */}
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-lg">Instant Donor Registration</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Register as an emergency volunteer donor in the Visakhapatnam region.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); triggerToast('Donor registered into Vizag Node roster!'); }} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Full Name</label>
                  <input type="text" required placeholder="e.g. Harini Prasanna" className="w-full px-3 py-2.5 rounded-lg bg-[#0e1b34] border border-[#1f3258] text-white focus:outline-none focus:border-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Blood Group</label>
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
                    <label className="block text-slate-300 mb-1 font-semibold">Phone Number</label>
                    <input type="tel" required placeholder="+91 98765 43210" className="w-full px-3 py-2.5 rounded-lg bg-[#0e1b34] border border-[#1f3258] text-white focus:outline-none focus:border-red-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Vizag Mandal / Locality</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-[#0e1b34] border border-[#1f3258] text-white focus:outline-none focus:border-red-500">
                    <option>Maharani Peta Mandal</option>
                    <option>Gajuwaka Mandal</option>
                    <option>Rushikonda Mandal</option>
                    <option>Arilova Mandal</option>
                    <option>Ram Nagar Mandal</option>
                    <option>Madhurawada</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 rounded-lg bg-[#d92d34] hover:bg-[#b91c22] text-white font-bold tracking-wide transition flex items-center justify-center gap