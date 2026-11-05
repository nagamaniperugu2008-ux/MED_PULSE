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
  Wifi,
  WifiOff,
  Flame,
  ArrowRight,
  Database,
  ShieldCheck,
  Send
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('escalation'); // 'escalation' | 'sms-demo' | 'outbreak'
  const [hospitals, setHospitals] = useState([]);
  const [activeIncident, setActiveIncident] = useState(null);
  const [incidentId, setIncidentId] = useState(null);
  const [pollTimer, setPollTimer] = useState(null);

  // SMS Gateway Simulation State
  const [isOffline, setIsOffline] = useState(false);
  const [smsPayload, setSmsPayload] = useState('MP|SOS|node-care|B_POS_PLT|3U|9F82');
  const [smsConsoleLogs, setSmsConsoleLogs] = useState([]);

  // Fetch Hospitals
  useEffect(() => {
    fetch(`${API_BASE}/hospitals`)
      .then(res => res.json())
      .then(d => setHospitals(d.data))
      .catch(() => {
        // Fallback dataset
        setHospitals([
          { id: 'node-care', name: 'Care Hospital Vizag', mandal: 'Maharani Peta', requiredBlood: 'B+ Platelets', riskPercentage: 76, riskLevel: 'HIGH', capacityCurrent: 18, capacityTotal: 40 },
          { id: 'node-asram', name: 'ASRAM Blood Center', mandal: 'Gajuwaka', requiredBlood: 'AB+ Platelets', riskPercentage: 31, riskLevel: 'LOW', capacityCurrent: 45, capacityTotal: 50 },
          { id: 'node-sevenhills', name: 'SevenHills Hospital', mandal: 'Ram Nagar', requiredBlood: 'O- PRBC', riskPercentage: 65, riskLevel: 'MED', capacityCurrent: 20, capacityTotal: 30 }
        ]);
      });
  }, []);

  // Poll active escalation status every 2 seconds
  useEffect(() => {
    if (!incidentId) return;

    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/escalation/status/${incidentId}`);
        const data = await res.json();
        if (data.success) {
          setActiveIncident(data.incident);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    setPollTimer(timer);
    return () => clearInterval(timer);
  }, [incidentId]);

  // Trigger Escalation Test
  const triggerEscalation = async (hospitalId) => {
    try {
      const res = await fetch(`${API_BASE}/escalation/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalId })
      });
      const data = await res.json();
      if (data.success) {
        setIncidentId(data.incidentId);
        setActiveIncident(data.incident);
      }
    } catch (e) {
      alert('Ensure the backend is running on port 5000');
    }
  };

  // Resolve Escalation
  const resolveIncident = async () => {
    if (!incidentId) return;
    await fetch(`${API_BASE}/escalation/resolve/${incidentId}`, { method: 'POST' });
    setActiveIncident(prev => prev ? { ...prev, status: 'RESOLVED', autoResolved: true } : null);
  };

  // Transmit Low-Bandwidth SMS Payload
  const transmitSmsPayload = async () => {
    try {
      const res = await fetch(`${API_BASE}/gateway/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawSms: smsPayload })
      });
      const data = await res.json();
      if (data.success) {
        setSmsConsoleLogs(prev => [
          `[SMS TOWER OK] 140-char packet unpacked: ${JSON.stringify(data.parsed)}`,
          `[TRIAGE INGEST] Spawned incident pipeline: ${data.incidentId}`,
          ...prev
        ]);
        setIncidentId(data.incidentId);
      }
    } catch (e) {
      alert('Check backend connectivity');
    }
  };

  return (
    <div className="min-h-screen bg-[#071120] text-slate-100 flex flex-col font-sans select-none">
      {/* HEADER */}
      <header className="bg-[#0b162c] border-b border-[#1b2b4d] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e62e2e] flex items-center justify-center text-white shadow-lg shadow-red-950">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">Med Pulse Core</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                RESILIENT TRIAGE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated Request Cascading & GSM Fallback System</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('escalation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
              activeTab === 'escalation' ? 'bg-[#d92d34] text-white shadow-md' : 'text-slate-300 hover:bg-[#13223f]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Escalation Pipeline</span>
          </button>

          <button 
            onClick={() => setActiveTab('sms-demo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
              activeTab === 'sms-demo' ? 'bg-[#d92d34] text-white shadow-md' : 'text-slate-300 hover:bg-[#13223f]'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span>Offline GSM Gateway</span>
          </button>

          <button 
            onClick={() => setActiveTab('outbreak')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition ${
              activeTab === 'outbreak' ? 'bg-[#d92d34] text-white shadow-md' : 'text-slate-300 hover:bg-[#13223f]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Cold-Start Nodes</span>
          </button>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

        {/* ========================================================
            VIEW 1: AUTOMATED 3-TIER ESCALATION PIPELINE VISUALIZER
           ======================================================== */}
        {activeTab === 'escalation' && (
          <div className="space-y-6">
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500" />
                    Automated Request Cascading State Machine
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trigger an emergency: If unanswered, watch the system cascade through Ring 0 (Donors) → Ring 1 (Fleet) → Ring 2 (Hospital Divert).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerEscalation('node-care')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
                  >
                    Simulate Care Hospital Emergency
                  </button>
                  {activeIncident && !activeIncident.autoResolved && (
                    <button
                      onClick={resolveIncident}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
                    >
                      Simulate Donor Answer (Resolve)
                    </button>
                  )}
                </div>
              </div>

              {/* RINGS PROGRESSION BAR */}
              <div className="grid grid-cols-3 gap-4 my-6">
                {/* RING 0 */}
                <div className={`p-4 rounded-xl border transition-all ${
                  activeIncident?.currentRing === 0 && !activeIncident?.autoResolved
                    ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/20' 
                    : activeIncident?.currentRing > 0 
                    ? 'bg-[#0f1d38] border-emerald-500/60 opacity-80' 
                    : 'bg-[#0f1d38] border-[#1b2b4d] opacity-50'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">RING 0 (0-180s)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300">Micro-Triage</span>
                  </div>
                  <div className="text-sm font-extrabold text-white">Targeted Donor IVR</div>
                  <p className="text-xs text-slate-400 mt-1">Direct voice call ping to 3 nearest matching donors via spatial proximity.</p>
                </div>

                {/* RING 1 */}
                <div className={`p-4 rounded-xl border transition-all ${
                  activeIncident?.currentRing === 1 && !activeIncident?.autoResolved
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20' 
                    : activeIncident?.currentRing > 1 
                    ? 'bg-[#0f1d38] border-emerald-500/60 opacity-80' 
                    : 'bg-[#0f1d38] border-[#1b2b4d] opacity-50'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">RING 1 (180-360s)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300">Cascade Expansion</span>
                  </div>
                  <div className="text-sm font-extrabold text-white">Secondary Blast + Courier Fleet</div>
                  <p className="text-xs text-slate-400 mt-1">Expands radius to 10 donors & alerts rapid-response motorbike transit units.</p>
                </div>

                {/* RING 2 */}
                <div className={`p-4 rounded-xl border transition-all ${
                  activeIncident?.currentRing === 2 && !activeIncident?.autoResolved
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20' 
                    : 'bg-[#0f1d38] border-[#1b2b4d] opacity-50'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">RING 2 (&gt;360s)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300">Inter-Hospital Divert</span>
                  </div>
                  <div className="text-sm font-extrabold text-white">Autonomous Reserve Transfer</div>
                  <p className="text-xs text-slate-400 mt-1">Overrides volunteer layer: Auto-requisitions surplus stock from ASRAM center.</p>
                </div>
              </div>

              {/* LIVE INCIDENT TELEMETRY LOGS */}
              <div className="bg-[#070e1c] rounded-xl p-4 border border-[#162747]">
                <div className="flex items-center justify-between border-b border-[#162747] pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    ACTIVE CASCADE TELEMETRY CONSOLE
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    STATUS: {activeIncident ? activeIncident.status : 'STANDBY - IDLE'}
                  </span>
                </div>

                <div className="h-44 overflow-y-auto font-mono text-xs space-y-2 text-slate-300">
                  {activeIncident?.logs && activeIncident.logs.length > 0 ? (
                    activeIncident.logs.map((log, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#0b162c] border border-[#152442]">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-600 text-center py-12">
                      Click "Simulate Care Hospital Emergency" to watch the automated cascade engine step through fallback rings.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: LOW-BANDWIDTH / GSM SMS FALLBACK SIMULATOR
           ======================================================== */}
        {activeTab === 'sms-demo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <WifiOff className="w-5 h-5 text-amber-500" />
                  Offline Clinic GSM Serializer
                </h3>
                <button
                  onClick={() => setIsOffline(!isOffline)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    isOffline ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {isOffline ? 'Internet: CUT (Using 2G SMS)' : 'Internet: CONNECTED'}
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                When rural clinics (e.g. in Anandapuram) lose 4G/5G, this subsystem packs the blood requisition into a 140-char string sent over standard GSM cellular control channels.
              </p>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">Generated SMS Frame (140 chars max)</label>
                <input 
                  type="text" 
                  value={smsPayload}
                  onChange={(e) => setSmsPayload(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#070e1c] border border-[#1f3258] font-mono text-xs text-emerald-400"
                />

                <div className="p-3 rounded-lg bg-[#0f1d38] border border-[#1b2b4d] text-xs text-slate-400">
                  <span className="font-bold text-slate-200">Protocol Spec:</span>
                  <div className="mt-1 font-mono text-[11px] space-y-0.5">
                    <div>PREFIX: MP (Med Pulse)</div>
                    <div>OPCODE: SOS</div>
                    <div>DEST: node-care (Care Hospital)</div>
                    <div>FRACTION: B_POS_PLT (B+ Platelets)</div>
                    <div>QUANTITY: 3U (3 Units)</div>
                    <div>CRC16: 9F82 (Data Integrity Check)</div>
                  </div>
                </div>

                <button
                  onClick={transmitSmsPayload}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Over GSM Webhook Gateway</span>
                </button>
              </div>
            </div>

            {/* GSM Base Station Parser Output */}
            <div className="bg-[#0b162b] border border-[#162747] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2 mb-2">
                  <Radio className="w-5 h-5 text-emerald-400" />
                  Cellular Gateway Ingestion Log
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Shows how the backend decodes the cellular frame and triggers the triage engine without active internet at the clinic.
                </p>

                <div className="bg-[#070e1c] rounded-xl p-4 border border-[#162747] h-64 overflow-y-auto font-mono text-xs text-emerald-400 space-y-2">
                  {smsConsoleLogs.length > 0 ? (
                    smsConsoleLogs.map((log, i) => (
                      <div key={i} className="p-2 rounded bg-[#0b162c] border border-[#152442]">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-600 text-center py-20">
                      Awaiting incoming GSM SMS transmission...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 3: COLD-START HOSPITAL NODES
           ======================================================== */}
        {activeTab === 'outbreak' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0f1d38] border border-[#1d3056] flex items-center justify-between text-xs">
              <span className="text-slate-300">
                <strong>Cold-Start Architecture:</strong> Instant public registry hydration ensures complete regional visibility even with 0 registered app donors on Day 1.
              </span>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-700 rounded-md font-bold">
                e-RaktKosh Sync: LIVE
              </span>
            </div>

            <div className="space-y-3">
              {hospitals.map(h => (
                <div key={h.id} className="bg-[#0b162b] border border-[#162747] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{h.name}</h4>
                    <span className="text-xs text-slate-400">{h.mandal}, Vizag</span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-[#2b1016] border border-[#6b1e25] text-red-300 font-bold text-xs">
                    {h.requiredBlood}
                  </span>
                  <div className="text-xs">
                    <span className="text-slate-400">Current Stock: </span>
                    <strong className="text-white">{h.capacityCurrent}/{h.capacityTotal} Units</strong>
                  </div>
                  <button
                    onClick={() => {
                      triggerEscalation(h.id);
                      setActiveTab('escalation');
                    }}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    Test Cascade
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}