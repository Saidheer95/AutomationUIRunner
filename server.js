
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const PROJECT_DIR = path.resolve(
    process.env.PLAYWRIGHT_PROJECT_DIR || path.join(__dirname, 'scripts')
);

app.use(cors());
app.use(express.json());

const scripts = {
    createEndtoEndFlow: {
        label: 'Create End to End Flow',
        args: ['playwright', 'test', 'tests/EndtoEndFlow/PR-Bid.spec.js']
    },
    createPR: {
        label: 'Create Direct PR',
        args: ['playwright', 'test', 'tests/PurchaseRequisition/createPR.spec.js']
    },
    createBid: {
        label: 'Create Direct Bid',
        args: ['playwright', 'test', 'tests/CreateBids/createBIdsDirect.spec.js']
    }
};

let activeRun = null;
let latestRun = null;

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        projectDir: PROJECT_DIR,
        projectExists: fs.existsSync(PROJECT_DIR),
        running: Boolean(activeRun)
    });
});

app.get('/api/scripts', (_req, res) => {
    res.json(
        Object.entries(scripts).map(([id, script]) => ({
            id,
            label: script.label
        }))
    );
});

app.get('/api/runs/current', (_req, res) => {
    if (!latestRun) {
        return res.json({ running: false, output: '' });
    }

    res.json({
        runId: latestRun.id,
        scriptId: latestRun.scriptId,
        running: latestRun.running,
        exitCode: latestRun.exitCode,
        output: latestRun.output
    });
});

app.post('/api/run', (req, res) => {
    const { scriptId } = req.body || {};
    const script = scripts[scriptId];

    if (!script) {
        return res.status(400).json({
            error: 'Select a valid test script.'
        });
    }

    if (activeRun) {
        return res.status(409).json({
            error: 'A test run is already in progress.',
            runId: activeRun.id
        });
    }

    if (!fs.existsSync(PROJECT_DIR)) {
        return res.status(500).json({
            error: `Playwright project directory not found: ${PROJECT_DIR}`
        });
    }

    const run = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        scriptId,
        running: true,
        output: '',
        exitCode: null
    };

    // Keep the active lock separate from the latest run history.
    activeRun = run;
    latestRun = run;

    const isWindows = process.platform === 'win32';
    const env = {
        ...process.env,
        FORCE_COLOR: '0'
    };

    if (isWindows) {
        env.ComSpec = process.env.ComSpec ||
            'C:\\Windows\\System32\\cmd.exe';
    }

    let child;

    try {
        child = spawn(
            isWindows ? 'npx.cmd' : 'npx',
            script.args,
            {
                cwd: PROJECT_DIR,
                shell: isWindows
                    ? env.ComSpec
                    : false,
                windowsHide: true,
                env
            }
        );
    } catch (err) {
        run.output += `\nFailed to start test process: ${err.message}\n`;
        run.running = false;
        run.exitCode = 1;

        if (activeRun === run) {
            activeRun = null;
        }

        return res.status(500).json({
            runId: run.id,
            error: err.message
        });
    }

    child.stdout.on('data', chunk => {
        run.output += chunk.toString();
    });

    child.stderr.on('data', chunk => {
        run.output += chunk.toString();
    });

    child.on('error', err => {
        run.output += `\nFailed to start test process: ${err.message}\n`;
        run.exitCode = 1;
        run.running = false;

        if (activeRun === run) {
            activeRun = null;
        }
    });

    child.on('close', (code, signal) => {
        run.exitCode = code === null ? 1 : code;
        run.running = false;

        run.output +=
            `\n\nProcess finished with exit code: ${run.exitCode}` +
            (signal ? ` (signal: ${signal})` : '') +
            '\n';

        // Release the lock so the next script can start.
        if (activeRun === run) {
            activeRun = null;
        }

        console.log(
            `Run ${run.id} completed. Exit code: ${run.exitCode}`
        );
    });

    res.json({
        runId: run.id,
        scriptId,
        message: 'Test execution started.'
    });
});

app.get('/api/runs/:runId', (req, res) => {
    const run = latestRun;

    if (!run || run.id !== req.params.runId) {
        return res.status(404).json({
            error: 'Run not found.'
        });
    }

    res.json({
        runId: run.id,
        scriptId: run.scriptId,
        running: run.running,
        exitCode: run.exitCode,
        output: run.output
    });
});

app.listen(PORT, () => {
    console.log(`Playwright runner backend listening on http://localhost:${PORT}`);
    console.log(`Playwright project: ${PROJECT_DIR}`);
});
