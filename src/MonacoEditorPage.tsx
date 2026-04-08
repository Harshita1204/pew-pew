import React, { useEffect, useMemo, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Link } from 'react-router-dom';
import './App.css';

type AnalysisResult = {
  score: number;
  riskLevel: string;
  suggestions?: string[];
};

const sampleSnippets: Record<string, string> = {
  javascript: `function checkout(cart) {
  if (!cart || cart.items.length === 0) return 0;

  let total = 0;
  for (const item of cart.items) {
    if (item.discount) {
      total += item.price * 0.9;
    } else {
      total += item.price;
    }
  }
  return total;
}
`,
  typescript: `type Order = { id: string; items: { price: number; isPriority: boolean }[] };

function calculatePriority(order: Order): number {
  let score = 0;
  for (const item of order.items) {
    if (item.isPriority) score += 2;
    else score += 1;
  }
  return score;
}
`,
  python: `def build_pipeline(stages):
    if not stages:
        return []

    results = []
    for stage in stages:
        if stage.get('enabled'):
            results.append(stage['name'])
    return results
`,
  php: `function normalizeUser(array $user): array {
    if (!isset($user['name'])) {
        return [];
    }

    $name = trim($user['name']);
    if ($name === '') {
        return [];
    }

    return ['name' => strtoupper($name)];
}
`,
};

const extensionMap: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  php: 'php',
};

const MonacoEditorPage = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [fileName, setFileName] = useState('main');
  const [prompt, setPrompt] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [activeChip, setActiveChip] = useState('');

  const promptChips = [
    'Build a REST endpoint to save course feedback',
    'Create a clean login form with validation',
    'Generate a service to analyze PHP files',
    'Write a scheduler for nightly data exports',
  ];

  useEffect(() => {
    if (!code.trim()) {
      setAnalysisResult(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleAnalyze();
    }, 900);

    return () => clearTimeout(timeoutId);
  }, [code, language]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!code.trim()) return;
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || 'Failed to generate report');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'code-report.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCode(true);
    setGenerationError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || 'Failed to generate code');
      }
      const result = await response.json();
      if (result.code) {
        setCode(result.code);
        setFileName('generated');
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate code');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleUseChip = (chip: string) => {
    setPrompt(chip);
    setActiveChip(chip);
  };

  const handleLoadSample = () => {
    setCode(sampleSnippets[language] || '');
    setFileName('sample');
  };

  const handleClearEditor = () => {
    setCode('');
    setFileName('main');
  };

  const suggestions = useMemo(() => {
    if (!analysisResult?.suggestions?.length) return [];
    return analysisResult.suggestions.slice(0, 6);
  }, [analysisResult]);

  return (
    <div className="page editor-page">
      <nav className="top-nav compact">
        <div className="brand">
          <span className="brand-mark">CL</span>
          <span className="brand-name">CodeLens Studio</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#insights">Insights</a>
          <a href="#reports">Reports</a>
        </div>
        <div className="nav-cta">
          <button className="btn ghost" onClick={handleAnalyze} disabled={isAnalyzing || !code.trim()}>
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </button>
          <button
            className="btn primary"
            onClick={handleDownloadReport}
            disabled={isGeneratingReport || !code.trim()}
          >
            {isGeneratingReport ? 'Building PDF...' : 'Generate PDF Report'}
          </button>
        </div>
      </nav>

      <main className="editor-shell">
        <section className="editor-workspace">
          <div className="editor-toolbar">
            <div>
              <h1>Code Intelligence Studio</h1>
              <p>Type your code, generate with AI, and export a growth report.</p>
            </div>
            <div className="toolbar-controls">
              <label>
                Language
                <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="php">PHP</option>
                </select>
              </label>
            </div>
          </div>

          <div className="editor-header-row">
            <div className="editor-tabs">
              <button className="tab active">Workspace</button>
              <button className="tab">AI Review</button>
              <button className="tab">Benchmarks</button>
            </div>
            <div className="editor-actions">
              <button className="btn ghost" onClick={handleLoadSample}>Load Sample</button>
              <button className="btn ghost" onClick={handleClearEditor}>Clear</button>
            </div>
          </div>

          <div className="prompt-card">
            <div>
              <h3>AI Code Generation</h3>
              <p>Describe what you want to build. We will generate a clean starter in your chosen language.</p>
            </div>
            <div className="prompt-chips">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  className={`chip ${activeChip === chip ? 'active' : ''}`}
                  onClick={() => handleUseChip(chip)}
                  type="button"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="prompt-controls">
              <input
                type="text"
                placeholder="e.g. Build an API endpoint to save course feedback"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
              <button className="btn primary" onClick={handleGenerateCode} disabled={isGeneratingCode || !prompt.trim()}>
                {isGeneratingCode ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
            {generationError && <p className="error-text">{generationError}</p>}
          </div>

          <div className="workspace-grid">
            <div className="file-tree-card">
              <h3>Workspace</h3>
              <button className="file-item active">
                {fileName}.{extensionMap[language]}
              </button>
              <button className="file-item">utils/helpers.{extensionMap[language]}</button>
              <button className="file-item">services/pipeline.{extensionMap[language]}</button>
              <button className="file-item">tests/quality.{extensionMap[language]}</button>
              <div className="tree-footer">
                <span>Last sync: 2 min ago</span>
                <span className="status-dot" />
              </div>
            </div>

            <div className="editor-stack">
              <div className="editor-panel">
                <MonacoEditor
                  height="520px"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                />
              </div>
              <div className="editor-statusbar">
                <span>File: {fileName}.{extensionMap[language]}</span>
                <span className="status-pill">Live Analysis {isAnalyzing ? 'On' : 'Idle'}</span>
                <span>Complexity Score: {analysisResult?.score ?? '--'}</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="editor-sidebar" id="insights">
          <div className="sidebar-card">
            <h2>Live Complexity</h2>
            <div className="score-chip">
              <span>Score</span>
              <strong>{analysisResult?.score ?? '--'}</strong>
            </div>
            <p className="risk-text">{analysisResult?.riskLevel ?? 'Paste code to start analysis.'}</p>
          </div>

          <div className="sidebar-card">
            <h2>AI Coach Notes</h2>
            {suggestions.length ? (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={`${suggestion}-${index}`}>{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p>Run an analysis to see refactor guidance.</p>
            )}
          </div>

          <div className="sidebar-card" id="reports">
            <h2>Growth Report</h2>
            <p>Generate a PDF report with improvement areas, mentorship notes, and next steps.</p>
            <button
              className="btn secondary full"
              onClick={handleDownloadReport}
              disabled={isGeneratingReport || !code.trim()}
            >
              {isGeneratingReport ? 'Preparing Report...' : 'Download Report'}
            </button>
          </div>

          <div className="sidebar-card">
            <h2>Use Cases</h2>
            <ul>
              <li>Team code health audits and sprint retrospectives</li>
              <li>Engineering onboarding and mentorship programs</li>
              <li>Portfolio-ready refactor walkthroughs</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default MonacoEditorPage;