// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store replicating the exact nodes from the dashboard
let hospitalNodes = [
  {
    id: 'node-care',
    name: 'Care Hospital Vizag',
    mandal: 'Maharani Peta Mandal, Vizag',
    isSample: true,
    requiredBlood: 'B+ Platelets',
    riskPercentage: 76,
    riskLevel: 'HIGH',
    capacityCurrent: 18,
    capacityTotal: 40,
    callsSent: 10,
    callsConfirmed: 8,
    avgEtaMins: 18,
    dispatchStatus: 'idle'
  },
  {
    id: 'node-asram',
    name: 'ASRAM Blood Center',
    mandal: 'Gajuwaka Mandal, Vizag',
    isSample: true,
    requiredBlood: 'AB+ Platelets',
    riskPercentage: 31,
    riskLevel: 'LOW',
    capacityCurrent: 45,
    capacityTotal: 50,
    callsSent: 0,
    callsConfirmed: 0,
    avgEtaMins: null,
    dispatchStatus: 'idle'
  },
  {
    id: 'node-sevenhills',
    name: 'SevenHills Hospital',
    mandal: 'Ram Nagar Mandal, Vizag',
    isSample: true,
    requiredBlood: 'O- PRBC',
    riskPercentage: 65,
    riskLevel: 'MED',
    capacityCurrent: 20,
    capacityTotal: 30,
    callsSent: 5,
    callsConfirmed: 4,
    avgEtaMins: 25,
    dispatchStatus: 'idle'
  },
  {
    id: 'node-gimsr',
    name: 'GIMSR Hospital',
    mandal: 'Rushikonda Mandal, Vizag',
    isSample: true,
    requiredBlood: 'A- Platelets',
    riskPercentage: 82,
    riskLevel: 'HIGH',
    capacityCurrent: 10,
    capacityTotal: 40,
    callsSent: 12,
    callsConfirmed: 9,
    avgEtaMins: 19,
    dispatchStatus: 'idle'
  },
  {
    id: 'node-apollo',
    name: 'Apollo Vizag',
    mandal: 'Arilova Mandal, Vizag',
    isSample: true,
    requiredBlood: 'B- Whole Blood',
    riskPercentage: 25,
    riskLevel: 'LOW',
    capacityCurrent: 28,
    capacityTotal: 30,
    callsSent: 0,
    callsConfirmed: 0,
    avgEtaMins: null,
    dispatchStatus: 'idle'
  }
];

// 1. Get all hospital network nodes
app.get('/api/hospitals', (req, res) => {
  res.json({
    success: true,
    nodeCluster: 'VIZAG_NODE',
    timestamp: new Date().toISOString(),
    data: hospitalNodes
  });
});

// 2. Trigger preemptive individual dispatch
app.post('/api/dispatch/:id', (req, res) => {
  const { id } = req.params;
  const hospital = hospitalNodes.find(h => h.id === id);

  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Node not found' });
  }

  // Simulate automated IVR call dispatch increment
  hospital.callsSent += 5;
  hospital.callsConfirmed += Math.floor(Math.random() * 3) + 2;
  hospital.avgEtaMins = hospital.avgEtaMins ? Math.max(12, hospital.avgEtaMins - 2) : 22;
  hospital.dispatchStatus = 'active';

  res.json({
    success: true,
    message: `Preemptive dispatch sent for ${hospital.name}`,
    updatedNode: hospital
  });
});

// 3. Trigger Global Emergency Network Dispatch
app.post('/api/emergency-dispatch', (req, res) => {
  const highRiskNodes = hospitalNodes.filter(h => h.riskLevel === 'HIGH' || h.riskLevel === 'MED');

  highRiskNodes.forEach(h => {
    h.callsSent += 10;
    h.callsConfirmed += 6;
    h.dispatchStatus = 'emergency_broadcast';
  });

  res.json({
    success: true,
    message: 'Global Emergency Dispatch broadcasted to all high/med risk nodes.',
    affectedNodes: highRiskNodes.map(h => h.id)
  });
});

app.listen(PORT, () => {
  console.log(`Med Pulse Backend running on http://localhost:${PORT}`);
});