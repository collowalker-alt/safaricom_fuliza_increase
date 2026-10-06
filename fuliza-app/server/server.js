import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// API routes must come before the frontend fallback.
const allowed = [
  { increase: 15000, fee: 630 },
  { increase: 20000, fee: 730 },
  { increase: 25000, fee: 880 },
  { increase: 30000, fee: 990 },
  { increase: 35000, fee: 1050 }
];

app.post('/api/payment/prompt', (req, res) => {
  const { msisdn, amount, increase } = req.body || {};
  const plan = allowed.find(
    x => x.increase === Number(increase) && x.fee === Number(amount)
  );

  if (!plan || !/^2547\d{8}$/.test(String(msisdn || ''))) {
    return res.status(400).json({ message: 'Invalid request details.' });
  }

  const demo = process.env.DEMO_MODE !== 'false';
  if (demo) {
    return res.json({
      demo: true,
      message: `Demo prompt prepared for ${msisdn}. In production, an authorized M-PESA Express prompt would be sent to this number for ${plan.fee} KSh.`
    });
  }

  return res.status(501).json({
    message: 'Production M-PESA integration is not configured.'
  });
});

app.post('/api/payment/callback', (req, res) => {
  console.log('M-PESA callback received:', JSON.stringify(req.body));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// Serve Vite's production build when it exists; otherwise serve the project root.
app.use(express.static(distDir));
app.use(express.static(rootDir));

// Express 5 wildcard syntax: /{*splat} (not '*').
app.get('/{*splat}', (req, res) => {
  const builtIndex = path.join(distDir, 'index.html');
  const rootIndex = path.join(rootDir, 'index.html');
  res.sendFile(fs.existsSync(builtIndex) ? builtIndex : rootIndex);
});

const port = Number(process.env.PORT) || 10000;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Fuliza Increase app listening on ${host}:${port} | DEMO_MODE=${process.env.DEMO_MODE !== 'false'}`);
});
