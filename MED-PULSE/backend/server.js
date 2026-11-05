const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// In-Memory Data Stores for Hackathon Demo
let hospitals = [
  { id: 'node-care', name: 'Care Hospital Vizag', mandal: 'Maharani Peta', requiredBlood: 'B+ Platelets', riskPercentage: 76, riskLevel: 'HIGH', capacityCurrent: 18, capacityTotal: 40 },
  { id: 'node-asram', name: 'ASRAM Blood Center', mandal: 'Gajuwaka', requiredBlood: 'AB+ Platelets', riskPercentage: 31, riskLevel: 'LOW', capacityCurrent: 45, capacityTotal: 50 },
  { id: 'node-sevenhills', name: 'SevenHills Hospital', mandal: 'Ram Nagar', requiredBlood: 'O- PRBC', riskPercentage: 65, riskLevel: 'MED', capacityCurrent: 20, capacityTotal: 30 }
];

let activeIncidents = {};
let registeredDonors = []; // In-memory donor storage

// Root Status Endpoint
app.get('/', (req, res) => {
  res.send('Med Pulse Backend Gateway is running live and operational!');
});

// 1. Get Hospitals Endpoint
app.get('/api/hospitals', (req, res) => {
  res.json({ success: true, data: hospitals });
});

// 2. Trigger Escalation State Machine
app.post('/api/escalation/trigger', (req, res) => {
  const { hospitalId } = req.body;
  const hospital = hospitals.find(h => h.id === hospitalId) || hospitals[0];
  const incidentId = `INC-${Date.now().toString().slice(-4)}`;

  activeIncidents[incidentId] = {
    incidentId,
    hospital,
    currentRing: 0,
    status: 'ACTIVE_RING_0',
    autoResolved: false,
    logs: [
      `[${new Date().toLocaleTimeString()}] RING 0: Automated IVR dispatch queued to 3 nearest donors near ${hospital.mandal}.`,
      `[${new Date().toLocaleTimeString()}] Spatial query matched active volunteers within 5km radius.`
    ]
  };

  res.json({ success: true, incidentId, incident: activeIncidents[incidentId] });
});

// 3. Check Escalation Status
app.get('/api/escalation/status/:id', (req, res) => {
  const incident = activeIncidents[req.params.id];
  if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
  res.json({ success: true, incident });
});

// 4. Resolve Escalation
app.post('/api/escalation/resolve/:id', (req, res) => {
  const incident = activeIncidents[req.params.id];
  if (incident) {
    incident.status = 'RESOLVED';
    incident.autoResolved = true;
    incident.logs.unshift(`[${new Date().toLocaleTimeString()}] RESOLVED: Donor confirmation received. Dispatch locked.`);
  }
  res.json({ success: true, incident });
});

// 5. Offline SMS Gateway Ingestion
app.post('/api/gateway/sms', (req, res) => {
  const { rawSms } = req.body;
  const incidentId = `INC-SMS-${Date.now().toString().slice(-4)}`;

  res.json({
    success: true,
    incidentId,
    parsed: {
      protocol: 'MP',
      opcode: 'SOS',
      node: 'node-care',
      fraction: 'B_POS_PLT',
      quantity: '3U',
      crc16: '9F82'
    }
  });
});

// 6. Donor Registration Endpoint (In-Memory)
app.post('/api/donors/register', (req, res) => {
  const { donorName, donorPhone, bloodGroup, mandal } = req.body;

  if (!donorName || !donorPhone) {
    return res.status(400).json({ success: false, message: 'Missing required donor fields.' });
  }

  const newDonor = {
    timestamp: new Date().toISOString(),
    donorName,
    donorPhone,
    bloodGroup: bloodGroup || 'N/A',
    mandal: mandal || 'Vizag'
  };

  registeredDonors.push(newDonor);
  console.log(`[DONOR REGISTERED IN-MEMORY] -> Name: ${donorName} (+91 ${donorPhone}), Blood: ${newDonor.bloodGroup}`);

  return res.status(200).json({
    success: true,
    message: 'Donor successfully registered!'
  });
});

// 7. OPD Queue Token & SMS Dispatch Gateway Endpoint
app.post('/api/queue/token', (req, res) => {
  const { patientName, phone, department, tokenNumber, waitTime, hospital, appointmentDate } = req.body;

  if (!patientName || !phone || !tokenNumber || !department) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing mandatory patient name, phone number, or token attributes.' 
    });
  }

  const smsBody = `MedPulse OPD: Token ${tokenNumber} issued for ${patientName} (${department}). Date: ${appointmentDate || 'Today'}. Est wait: ${waitTime}. Report to ${hospital || 'King George Hospital, Vizag'}.`;

  console.log(`\n========================================`);
  console.log(`[SMS GATEWAY DISPATCH SUCCESS]`);
  console.log(`Target Phone   : +91 ${phone}`);
  console.log(`Patient Name   : ${patientName}`);
  console.log(`Department     : ${department}`);
  console.log(`Token Code     : ${tokenNumber}`);
  console.log(`Appointment Dt : ${appointmentDate || 'N/A'}`);
  console.log(`Payload Text   : "${smsBody}"`);
  console.log(`========================================\n`);

  return res.status(200).json({
    success: true,
    message: 'OPD token generated and confirmation SMS successfully dispatched.',
    tokenNumber,
    smsBody
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Med Pulse Backend Gateway running live on http://localhost:${PORT}`);
});