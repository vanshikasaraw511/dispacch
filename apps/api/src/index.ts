import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const ENGINE_URL = process.env.ENGINE_URL || 'http://127.0.0.1:8000';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Dispacch API Gateway' });
});

// Forward dedicated fleet optimization
app.post('/api/recommend/vehicle', async (req, res) => {
  try {
    const pyRes = await fetch(`${ENGINE_URL}/optimize/recommend-vehicle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await pyRes.json();
    return res.status(pyRes.status).json(data);
  } catch (err: any) {
    return res.status(502).json({ success: false, message: 'Optimizer backend unreachable' });
  }
});

// Forward community pool (LTL) matching
app.post('/api/recommend/shared-pool', async (req, res) => {
  try {
    const pyRes = await fetch(`${ENGINE_URL}/optimize/find-shared-pools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await pyRes.json();
    return res.status(pyRes.status).json(data);
  } catch (err: any) {
    return res.status(502).json({ success: false, message: 'Shared pool backend unreachable' });
  }
});

app.listen(PORT, () => {
  console.log(`Dispacch API Gateway running on port ${PORT}`);
});