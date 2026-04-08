/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MonacoEditorPage from './MonacoEditorPage';
import './App.css';

const HomePage = () => (
  <div className="page home-page">
    <div className="mesh-bg" aria-hidden="true" />
    <nav className="top-nav">
      <div className="brand">
        <span className="brand-mark">CL</span>
        <span className="brand-name">CodeLens Learning Lab</span>
      </div>
      <div className="nav-links">
        <a href="#platform">Platform</a>
        <a href="#labs">Studios</a>
        <a href="#curriculum">Tracks</a>
        <a href="#outcomes">Results</a>
      </div>
      <div className="nav-cta">
        <Link to="/editor" className="btn ghost">Launch Studio</Link>
        <Link to="/editor" className="btn primary">Start Free Trial</Link>
      </div>
    </nav>

    <header className="hero">
      <div className="hero-copy">
        <span className="pill">Code coaching meets edtech</span>
        <h1>Make every code review feel like a mentorship moment.</h1>
        <p>
          A modern learning platform that blends live complexity scoring, AI refactors, and
          personalized growth roadmaps for every developer.
        </p>
        <div className="hero-actions">
          <Link to="/editor" className="btn primary">Analyze Your Code</Link>
          <a href="#curriculum" className="btn secondary">Explore Tracks</a>
        </div>
        <div className="hero-metrics">
          <div className="metric-chip">
            <h3>42k+</h3>
            <span>Active learners</span>
          </div>
          <div className="metric-chip">
            <h3>1.3M</h3>
            <span>Analyses delivered</span>
          </div>
          <div className="metric-chip">
            <h3>4.9/5</h3>
            <span>Mentor rating</span>
          </div>
        </div>
      </div>
      <div className="hero-card">
        <div className="hero-card-header">
          <span>Live Cohort</span>
          <span className="status-dot" />
        </div>
        <div className="hero-card-body">
          <div className="metric">
            <h4>Complexity Trend</h4>
            <p>Week 6 improved by 38%</p>
          </div>
          <div className="metric">
            <h4>AI Refactor Plan</h4>
            <p>Generated in 12 seconds</p>
          </div>
          <div className="metric">
            <h4>Next Growth Area</h4>
            <p>Pattern decomposition</p>
          </div>
        </div>
      </div>
    </header>

    <section id="platform" className="section platform">
      <div className="section-header">
        <h2>The learning OS for clean, scalable code</h2>
        <p>Build mastery with guided studios, performance dashboards, and AI coaching.</p>
      </div>
      <div className="feature-grid">
        <article className="card feature-card">
          <h3>Skill Pathways</h3>
          <p>Role-based tracks for backend, frontend, and full-stack mastery.</p>
        </article>
        <article className="card feature-card">
          <h3>Realtime Code Studio</h3>
          <p>Complexity scoring with refactor prompts as you type.</p>
        </article>
        <article className="card feature-card">
          <h3>Coach Insights</h3>
          <p>Gemini-powered feedback with growth plans and action steps.</p>
        </article>
        <article className="card feature-card">
          <h3>Team Playbooks</h3>
          <p>Shared standards, review checklists, and coaching templates.</p>
        </article>
      </div>
    </section>

    <section id="labs" className="section labs">
      <div className="labs-grid">
        <div className="labs-copy">
          <h2>Studios that feel like real teams.</h2>
          <p>
            Simulate sprint cycles with guided challenges, scoring, and mentor notes. Every session
            ends with a shareable growth report.
          </p>
          <ul>
            <li>Scenario-driven refactor missions</li>
            <li>Pair-programming feedback loops</li>
            <li>Career-ready portfolio evidence</li>
          </ul>
        </div>
        <div className="labs-panel">
          <div className="panel-row">
            <span>Studio Completion</span>
            <strong>87%</strong>
          </div>
          <div className="panel-row">
            <span>Mentor Notes</span>
            <strong>2.4k weekly</strong>
          </div>
          <div className="panel-row">
            <span>Hiring Signals</span>
            <strong>Top 12%</strong>
          </div>
        </div>
      </div>
    </section>

    <section id="curriculum" className="section curriculum">
      <div className="section-header">
        <h2>Tracks designed for growth</h2>
        <p>From fundamentals to architecture patterns, every module is measurable.</p>
      </div>
      <div className="curriculum-track">
        <div className="track-item card">
          <h3>Foundation</h3>
          <p>Complexity literacy, clean code, and refactor strategy.</p>
        </div>
        <div className="track-item card">
          <h3>Applied</h3>
          <p>Scale patterns, testing discipline, and performance profiling.</p>
        </div>
        <div className="track-item card">
          <h3>Leadership</h3>
          <p>Design reviews, mentoring, and engineering rituals.</p>
        </div>
      </div>
    </section>

    <section id="outcomes" className="section outcomes">
      <div className="section-header">
        <h2>Measured outcomes</h2>
        <p>Teams and learners see real impact within weeks.</p>
      </div>
      <div className="outcome-grid">
        <article className="card outcome-card">
          <h3>35% Faster Reviews</h3>
          <p>AI summaries and clarity checks shorten feedback loops.</p>
        </article>
        <article className="card outcome-card">
          <h3>28% Lower Risk</h3>
          <p>Complexity insights highlight early refactor opportunities.</p>
        </article>
        <article className="card outcome-card">
          <h3>Verified Growth</h3>
          <p>Exportable reports show skill progression and next steps.</p>
        </article>
      </div>
    </section>

    <section className="section cta">
      <div>
        <h2>Ready to build an engineering advantage?</h2>
        <p>Launch the Code Intelligence Studio and generate a learning report in minutes.</p>
      </div>
      <Link to="/editor" className="btn primary">Open Code Studio</Link>
    </section>

    <footer className="site-footer">
      <div>
        <div className="footer-brand">
          <span className="brand-mark">CL</span>
          <div>
            <strong>CodeLens Learning Lab</strong>
            <p>Crafted for engineers who want measurable growth.</p>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="#platform">Learning OS</a>
            <a href="#labs">Studios</a>
            <a href="#curriculum">Tracks</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#outcomes">Outcomes</a>
            <a href="/editor">Code Studio</a>
            <a href="#">Docs</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CodeLens Academy. All rights reserved.</span>
        <span>Made with care for modern engineering teams.</span>
      </div>
    </footer>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<MonacoEditorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
