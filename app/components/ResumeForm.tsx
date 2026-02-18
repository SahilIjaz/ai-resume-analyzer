"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  ListChecks,
  FileText,
  UploadCloud,
  Zap,
  RotateCcw,
} from "lucide-react";

const ROLES = [
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "AI Engineer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "UI/UX Designer",
];

export default function ResumeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please upload a PDF resume.");
      return;
    }
    if (!role) {
      setError("Please select a target role.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    try {
      setLoading(true);
      // const response = await fetch("http://localhost:4000/api/analyze", {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRole("");
    setResult(null);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --ink: #0a0a0f;
          --paper: #f5f2eb;
          --cream: #ede9df;
          --accent: #d4420a;
          --accent2: #1a6b3c;
          --accent3: #1e3a6e;
          --muted: #8a8580;
          --border: rgba(10,10,15,0.12);
          --card: #ffffff;
        }

        .riq-root {
          font-family: 'DM Mono', monospace;
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          position: relative;
        }

        .riq-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.6;
        }

        /* HEADER */
        .riq-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          background: rgba(245,242,235,0.92);
          backdrop-filter: blur(12px);
          z-index: 100;
        }

        .riq-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.03em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .riq-logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent);
          animation: riq-pulse 2s ease-in-out infinite;
        }

        .riq-header-tag {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 0.3rem 0.8rem;
          border-radius: 2px;
        }

        /* MAIN */
        .riq-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        /* HERO */
        .riq-hero {
          text-align: center;
          margin-bottom: 4rem;
          animation: riq-fadeUp 0.6s ease both;
        }

        .riq-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .riq-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }

        .riq-title em {
          font-style: italic;
          color: var(--accent);
        }

        .riq-subtitle {
          font-size: 0.9rem;
          color: var(--muted);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* SECTION CARD */
        .riq-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .riq-section-01::before { content: '01'; position: absolute; top: 1.5rem; right: 2rem; font-family: 'Syne', sans-serif; font-size: 4rem; font-weight: 800; color: var(--cream); line-height: 1; pointer-events: none; }
        .riq-section-02::before { content: '02'; position: absolute; top: 1.5rem; right: 2rem; font-family: 'Syne', sans-serif; font-size: 4rem; font-weight: 800; color: var(--cream); line-height: 1; pointer-events: none; }

        .riq-section-label {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .riq-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* DROP ZONE */
        .riq-dropzone {
          border: 2px dashed var(--border);
          border-radius: 3px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          background: var(--paper);
        }

        .riq-dropzone:hover, .riq-dropzone-active {
          border-color: var(--accent);
          background: rgba(212,66,10,0.03);
        }

        .riq-drop-icon {
          width: 48px; height: 48px;
          margin: 0 auto 1rem;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--border);
          border-radius: 3px;
          background: var(--card);
          color: var(--accent);
        }

        .riq-drop-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.4rem;
        }

        .riq-drop-sub { font-size: 0.75rem; color: var(--muted); }

        /* FILE SELECTED */
        .riq-file-pill {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(26,107,60,0.06);
          border: 1px solid rgba(26,107,60,0.2);
          border-radius: 3px;
          margin-top: 1rem;
        }

        .riq-file-icon {
          width: 36px; height: 36px;
          background: var(--accent2);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }

        .riq-file-name {
          font-size: 0.8rem;
          color: var(--accent2);
          flex: 1;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .riq-file-remove {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 1.2rem; line-height: 1;
          transition: color 0.2s;
        }
        .riq-file-remove:hover { color: var(--accent); }

        /* ROLE INPUT */
        .riq-role-input {
          width: 100%;
          background: var(--paper);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 1rem 1.25rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.9rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
        }

        .riq-role-input:focus { border-color: var(--ink); }

        /* CHIPS */
        .riq-chips {
          display: flex; flex-wrap: wrap; gap: 0.5rem;
          margin-top: 1rem;
        }

        .riq-chip {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          padding: 0.35rem 0.8rem;
          border: 1px solid var(--border);
          border-radius: 2px;
          cursor: pointer;
          background: var(--paper);
          color: var(--muted);
          transition: all 0.2s;
        }

        .riq-chip:hover, .riq-chip-active {
          border-color: var(--ink);
          color: var(--ink);
          background: var(--cream);
        }

        /* ERROR */
        .riq-error {
          background: rgba(212,66,10,0.06);
          border: 1px solid rgba(212,66,10,0.2);
          border-radius: 3px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.8rem;
          color: var(--accent);
          line-height: 1.6;
        }

        /* SUBMIT */
        .riq-submit {
          width: 100%;
          padding: 1.1rem 2rem;
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 3px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: background 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
        }

        .riq-submit:hover:not(:disabled) { background: var(--accent); }
        .riq-submit:disabled { opacity: 0.45; cursor: not-allowed; }

        /* LOADING */
        .riq-loading {
          text-align: center;
          padding: 5rem 2rem;
        }

        .riq-spin {
          animation: riq-spin 1s linear infinite;
          transform-origin: center;
        }

        .riq-loading-text {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .riq-loading-sub { font-size: 0.75rem; color: var(--muted); }

        .riq-loading-steps {
          display: flex; justify-content: center; gap: 1.5rem;
          margin-top: 2rem; flex-wrap: wrap;
        }

        .riq-step {
          font-size: 0.7rem; color: var(--muted);
          display: flex; align-items: center; gap: 0.4rem;
        }

        .riq-step-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--border);
          animation: riq-stepPulse 1.5s ease infinite;
        }

        /* SCORE HERO */
        .riq-score-hero {
          background: var(--ink);
          color: var(--paper);
          border-radius: 4px;
          padding: 3rem;
          margin-bottom: 1.5rem;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .riq-score-hero::before {
          content: '';
          position: absolute;
          top: -50%; right: -10%;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(212,66,10,0.15);
          pointer-events: none;
        }

        .riq-score-circle {
          width: 140px; height: 140px;
          position: relative; flex-shrink: 0;
        }

        .riq-score-inner {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }

        .riq-score-num {
          font-family: 'Syne', sans-serif;
          font-size: 2.5rem; font-weight: 800;
          line-height: 1; color: white;
        }

        .riq-score-label {
          font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-top: 0.2rem;
        }

        .riq-score-info h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem; line-height: 1.1;
          margin-bottom: 0.75rem; color: white;
        }

        .riq-score-info p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.7; max-width: 400px;
        }

        .riq-score-info p strong { color: rgba(255,255,255,0.9); }

        .riq-grade {
          display: inline-block; margin-top: 1rem;
          padding: 0.3rem 0.8rem; border-radius: 2px;
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
        }

        .riq-grade-good { background: rgba(26,107,60,0.3); color: #6fcf97; }
        .riq-grade-avg  { background: rgba(230,180,30,0.2); color: #f2c94c; }
        .riq-grade-low  { background: rgba(212,66,10,0.3); color: #ff8a65; }

        /* RESULTS GRID */
        .riq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem; margin-bottom: 1.5rem;
        }

        .riq-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 4px; overflow: hidden;
        }

        .riq-card-full { grid-column: 1 / -1; }

        .riq-card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 0.75rem;
        }

        .riq-card-icon {
          width: 32px; height: 32px; border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .riq-icon-red   { background: rgba(212,66,10,0.1); color: var(--accent); }
        .riq-icon-green { background: rgba(26,107,60,0.1); color: var(--accent2); }
        .riq-icon-blue  { background: rgba(30,58,110,0.1); color: var(--accent3); }

        .riq-card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.85rem; letter-spacing: 0.02em;
        }

        .riq-card-count {
          margin-left: auto; font-size: 0.7rem;
          color: var(--muted); background: var(--cream);
          padding: 0.2rem 0.6rem; border-radius: 20px;
        }

        .riq-card-body { padding: 1.25rem 1.5rem; }

        /* SKILL TAGS */
        .riq-skill-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }

        .riq-skill-tag {
          font-size: 0.72rem; padding: 0.35rem 0.75rem;
          border-radius: 2px;
          background: rgba(212,66,10,0.07);
          border: 1px solid rgba(212,66,10,0.15);
          color: var(--accent);
          font-family: 'DM Mono', monospace;
        }

        /* NUMBERED LIST */
        .riq-num-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }

        .riq-num-list li {
          display: flex; gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.8rem; line-height: 1.6;
        }

        .riq-item-num {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.65rem;
          color: var(--muted); min-width: 22px;
          padding-top: 0.15rem; flex-shrink: 0;
        }

        .riq-critical {
          display: inline-block; font-size: 0.6rem;
          padding: 0.1rem 0.4rem;
          background: rgba(212,66,10,0.15);
          color: var(--accent); border-radius: 2px;
          margin-right: 0.4rem; font-weight: 700;
          letter-spacing: 0.05em; vertical-align: middle;
        }

        /* RESET */
        .riq-reset {
          display: flex; align-items: center; gap: 0.5rem;
          margin: 2rem auto 0;
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--border); border-radius: 3px;
          background: none; font-family: 'DM Mono', monospace;
          font-size: 0.8rem; color: var(--muted); cursor: pointer;
          transition: all 0.2s;
        }

        .riq-reset:hover { border-color: var(--ink); color: var(--ink); }

        /* ANIMATIONS */
        @keyframes riq-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes riq-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes riq-spin { to { transform: rotate(360deg); } }
        @keyframes riq-stepPulse {
          0%, 100% { background: var(--border); }
          50% { background: var(--accent); }
        }

        @media (max-width: 700px) {
          .riq-header { padding: 1.25rem 1.25rem; }
          .riq-main { padding: 2rem 1rem; }
          .riq-score-hero { grid-template-columns: 1fr; text-align: center; }
          .riq-score-hero::before { display: none; }
          .riq-score-circle { margin: 0 auto; }
          .riq-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="riq-root">
        {/* HEADER */}
        <header className="riq-header">
          <div className="riq-logo">
            <div className="riq-logo-dot" />
            ResumeIQ
          </div>
          <div className="riq-header-tag">AI-Powered Analysis</div>
        </header>

        <main className="riq-main">
          <AnimatePresence mode="wait">
            {/* ── FORM STATE ── */}
            {!loading && !result && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                {/* Hero */}
                <div className="riq-hero">
                  <div className="riq-eyebrow">Powered by Claude AI</div>
                  <h1 className="riq-title">
                    Get your resume
                    <br />
                    <em>ruthlessly reviewed</em>
                  </h1>
                  <p className="riq-subtitle">
                    Upload your PDF resume, pick your target role, and receive a
                    detailed AI analysis with actionable feedback in seconds.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Upload */}
                  <div className="riq-section riq-section-01">
                    <div className="riq-section-label">Upload Resume</div>
                    <div
                      className={`riq-dropzone ${dragover ? "riq-dropzone-active" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragover(true);
                      }}
                      onDragLeave={() => setDragover(false)}
                      onDrop={handleDrop}
                      onClick={() => inputRef.current?.click()}
                    >
                      <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <div className="riq-drop-icon">
                        <UploadCloud size={22} />
                      </div>
                      <div className="riq-drop-title">Drop your PDF here</div>
                      <div className="riq-drop-sub">
                        or click to browse — PDF files only
                      </div>
                    </div>

                    {file && (
                      <div className="riq-file-pill">
                        <div className="riq-file-icon">
                          <FileText size={18} />
                        </div>
                        <div className="riq-file-name">{file.name}</div>
                        <button
                          type="button"
                          className="riq-file-remove"
                          onClick={() => setFile(null)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Role */}
                  <div className="riq-section riq-section-02">
                    <div className="riq-section-label">Target Role</div>
                    <select
                      className="riq-role-input"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">-- Select a role --</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <div className="riq-chips">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`riq-chip ${role === r ? "riq-chip-active" : ""}`}
                          onClick={() => setRole(r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <div className="riq-error">{error}</div>}

                  <button
                    type="submit"
                    className="riq-submit"
                    disabled={!file || !role}
                  >
                    <Zap size={18} />
                    <span>Analyze Resume</span>
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── LOADING STATE ── */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="riq-loading"
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  style={{ margin: "0 auto 1.5rem", display: "block" }}
                >
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    stroke="#e0ddd6"
                    strokeWidth="4"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    stroke="#d4420a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="60 104"
                    className="riq-spin"
                  />
                </svg>
                <div className="riq-loading-text">Analyzing your resume…</div>
                <div className="riq-loading-sub">
                  Claude AI is reviewing your document
                </div>
                <div className="riq-loading-steps">
                  {[
                    "Parsing PDF",
                    "Evaluating skills",
                    "Generating feedback",
                  ].map((s, i) => (
                    <div key={s} className="riq-step">
                      <div
                        className="riq-step-dot"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                      {s}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── RESULTS STATE ── */}
            {!loading && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Score Hero */}
                <ScoreHero score={result.score} role={role} />

                {/* Cards Grid */}
                <div className="riq-grid">
                  <ResultCard
                    title="Missing Skills"
                    iconClass="riq-icon-red"
                    icon={<AlertCircle size={16} />}
                    count={result.missing_skills?.length}
                  >
                    <div className="riq-skill-list">
                      {result.missing_skills?.map(
                        (skill: string, i: number) => (
                          <span key={i} className="riq-skill-tag">
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </ResultCard>

                  <ResultCard
                    title="Improvement Plan"
                    iconClass="riq-icon-green"
                    icon={<ListChecks size={16} />}
                    count={result.improvement_plan?.length}
                  >
                    <NumberedList items={result.improvement_plan} />
                  </ResultCard>

                  <ResultCard
                    title="Rewrite Suggestions"
                    iconClass="riq-icon-blue"
                    icon={<CheckCircle size={16} />}
                    count={result.rewrite_suggestions?.length}
                    fullWidth
                  >
                    <NumberedList
                      items={result.rewrite_suggestions}
                      showCritical
                    />
                  </ResultCard>
                </div>

                <button className="riq-reset" onClick={handleReset}>
                  <RotateCcw size={14} />
                  Analyze another resume
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

/* ── SUB-COMPONENTS ── */

function ScoreHero({ score, role }: { score: number; role: string }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference * (1 - score / 100);

  const grade =
    score >= 80
      ? {
          label: "✦ Strong Candidate",
          cls: "riq-grade-good",
          heading: "Excellent Resume",
        }
      : score >= 60
        ? {
            label: "◈ Good Foundation",
            cls: "riq-grade-avg",
            heading: "Solid, Needs Work",
          }
        : {
            label: "◇ Needs Improvement",
            cls: "riq-grade-low",
            heading: "Significant Gaps",
          };

  return (
    <div className="riq-score-hero">
      <div className="riq-score-circle">
        <svg
          viewBox="0 0 140 140"
          width={140}
          height={140}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="#d4420a"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="riq-score-inner">
          <motion.span
            className="riq-score-num"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {score}
          </motion.span>
          <div className="riq-score-label">/ 100</div>
        </div>
      </div>

      <div className="riq-score-info">
        <h2>{grade.heading}</h2>
        <p>
          Your resume has been analyzed for the <strong>{role}</strong> role.
          Review the detailed feedback below to improve your chances.
        </p>
        <span className={`riq-grade ${grade.cls}`}>{grade.label}</span>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  iconClass,
  icon,
  count,
  children,
  fullWidth = false,
}: any) {
  return (
    <div className={`riq-card ${fullWidth ? "riq-card-full" : ""}`}>
      <div className="riq-card-header">
        <div className={`riq-card-icon ${iconClass}`}>{icon}</div>
        <div className="riq-card-title">{title}</div>
        <div className="riq-card-count">{count} items</div>
      </div>
      <div className="riq-card-body">{children}</div>
    </div>
  );
}

function NumberedList({
  items,
  showCritical = false,
}: {
  items: string[];
  showCritical?: boolean;
}) {
  return (
    <ul className="riq-num-list">
      {items?.map((item: string, i: number) => {
        const isCritical =
          showCritical && item.toLowerCase().startsWith("critical");
        const text = isCritical ? item.replace(/^CRITICAL:\s*/i, "") : item;
        return (
          <li key={i}>
            <span className="riq-item-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              {isCritical && <span className="riq-critical">CRITICAL</span>}
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
