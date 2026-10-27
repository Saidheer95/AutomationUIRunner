import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:3001/api';

export default function App() {
  const [scripts, setScripts] = useState([]);
  const [scriptId, setScriptId] = useState('');
  const [runId, setRunId] = useState('');
  const [run, setRun] = useState(null);
  const [error, setError] = useState('');
  const outputRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/scripts`)
      .then(r => { if (!r.ok) throw new Error('Could not load scripts.'); return r.json(); })
      .then(data => { setScripts(data); if (data.length) setScriptId(data[0].id); })
      .catch(err => setError(`${err.message} Is the backend running on port 3001?`));
  }, []);

  useEffect(() => {
    if (!runId) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetch(`${API}/runs/${runId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not retrieve run status.');
        if (cancelled) return;
        setRun(data);
        if (data.running) timer = setTimeout(poll, 1000);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    };
    let timer = setTimeout(poll, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [runId, run?.output, run?.running]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [run?.output]);

  async function startRun() {
    setError('');
    setRun(null);
    setRunId('');
    try {
      const response = await fetch(`${API}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to start test.');
      setRunId(data.runId);
      setRun({ running: true, output: 'Starting Playwright test...' });
    } catch (err) {
      setError(`${err.message} Check that the backend is running and the project path is correct.`);
    }
  }

  const running = Boolean(run?.running);

  return (
    <main className="page">
      <header className="header">
        <div className="eyebrow">QA AUTOMATION</div>
        <h1>Playwright Test Runner</h1>
        <p>Select a test from the dropdown and run it from this dashboard.</p>
      </header>

      <section className="panel">
        <label htmlFor="script">Test script</label>
        <div className="controls">
          <select id="script" value={scriptId} onChange={e => setScriptId(e.target.value)} disabled={running}>
            {scripts.map(script => <option key={script.id} value={script.id}>{script.label}</option>)}
          </select>
          <button onClick={startRun} disabled={!scriptId || running}>
            {running ? 'Test Running…' : 'Run Test'}
          </button>
        </div>
        {/* <div className="script-path">
          <span>Command</span>
          <code>npx playwright test tests/CreateBids/createBIdsDirect.spec.js</code>
        </div> */}
        {error && <div className="error">{error}</div>}
      </section>

      <section className="panel results">
        <div className="result-heading">
          <div>
            <h2>Execution output</h2>
            <p>Live stdout and stderr from the Playwright process</p>
          </div>
          <span className={`status ${running ? 'active' : run && run.exitCode === 0 ? 'passed' : run ? 'failed' : ''}`}>
            {running ? 'RUNNING' : run ? (run.exitCode === 0 ? 'PASSED' : 'FINISHED') : 'IDLE'}
          </span>
        </div>
        <pre ref={outputRef}>{run?.output || 'No test execution yet. Choose a script and click Run Test.'}</pre>
        {run && !running && <p className="exit">Exit code: {run.exitCode}</p>}
      </section>
      <footer>Frontend: localhost:5173 · Backend: localhost:3001</footer>
    </main>
  );
}