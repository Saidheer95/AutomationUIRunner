const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const PROJECT_DIR = process.env.PLAYWRIGHT_PROJECT_DIR || path.join(__dirname, 'automation');

app.use(cors());
app.use(express.json());

const scripts = {
  createEndtoEndFlow: {
    label: 'Create End to End Flow',
    command: 'npx',
    args: ['playwright', 'test', 'tests/EndtoEndFlow/PR-Bid.spec.js']
  },
  createPR: {
    label: 'Create Direct PR',
    command: 'npx',
    args: ['playwright', 'test', 'tests/PurchaseRequisition/createPR.spec.js']
  },
  create: {
    label: 'Create ',
    command: 'npx',
    args: ['playwright', 'test', 'tests/PurchaseRequisition/createPR.spec.js']
  },
  createPR: {
    label: 'Create Direct PR',
    command: 'npx',
    args: ['playwright', 'test', 'tests/PurchaseRequisition/createPR.spec.js']
  },

};

let activeRun = null;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', projectDir: PROJECT_DIR, running: Boolean(activeRun) });
});

app.get('/api/scripts', (_req, res) => {
  res.json(Object.entries(scripts).map(([id, script]) => ({ id, label: script.label })));
});

app.get('/api/runs/current', (_req, res) => {
  res.json(activeRun ? { running: true, runId: activeRun.id, output: activeRun.output } : { running: false });
});

app.post('/api/run', (req, res) => {
  const { scriptId } = req.body || {};
  const script = scripts[scriptId];

  if (!script) return res.status(400).json({ error: 'Select a valid test script.' });
  if (activeRun) return res.status(409).json({ error: 'A test run is already in progress.' });

  const run = { id: Date.now().toString(), scriptId, running: true, output: '', exitCode: null };
  activeRun = run;

  const isWindows = process.platform === 'win32';
  const child = spawn(isWindows ? 'npx.cmd' : script.command, script.args, {
    cwd: PROJECT_DIR,
    shell: isWindows,
    env: { ...process.env, FORCE_COLOR: '0' }
  });

  child.stdout.on('data', chunk => { run.output += chunk.toString(); });
  child.stderr.on('data', chunk => { run.output += chunk.toString(); });
  child.on('error', err => {
    run.output += `\nFailed to start test process: ${err.message}\n`;
    run.running = false;
    run.exitCode = 1;
  });
  child.on('close', code => {
    run.running = false;
    run.exitCode = code;
    run.output += `\n\nProcess finished with exit code: ${code}\n`;
  });

  res.json({ runId: run.id, message: 'Test execution started.' });
});

app.get('/api/runs/:runId', (req, res) => {
  if (!activeRun || activeRun.id !== req.params.runId) {
    return res.status(404).json({ error: 'Run not found.' });
  }
  res.json({
    runId: activeRun.id,
    scriptId: activeRun.scriptId,
    running: activeRun.running,
    exitCode: activeRun.exitCode,
    output: activeRun.output
  });
});

app.listen(PORT, () => {
  console.log(`Playwright runner backend listening on http://localhost:${PORT}`);
  console.log(`Playwright project: ${PROJECT_DIR}`);
});