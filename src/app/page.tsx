"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight, BadgeCheck, BrainCircuit, Building2, CalendarClock, Check, CheckCircle2,
  ChevronDown, ChevronRight, Clock3, Cpu, FileCheck2, FileSearch, FileText, Fingerprint,
  GraduationCap, Heater, Lightbulb, LockKeyhole, Minus, MoreHorizontal, Network, Play,
  Radio, ScanLine, Send, Shield, ShieldAlert, ShieldCheck, Sparkles, UploadCloud, Users,
  Waves, Wifi, Zap
} from "lucide-react";
import type { AuditEvent, EdgeEventType, EdgeSnapshot, Persona } from "@/lib/types";

const initialSnapshot: EdgeSnapshot = {
  nodeId: "4B",
  event: "BOOT",
  timestamp: new Date().toISOString(),
  eventId: "evt-demo-boot",
  occupancy: 42,
  hvacOn: true,
  lightingOn: true,
  energySavedPercent: 25.4,
  lastLatencyMs: 142,
  riskScore: 46,
  tutorActive: false,
  attendanceStatus: "PRESENT",
  earlyExitMinute: null,
  events: [
    { id: "boot-1", nodeId: "4B", source: "SYSTEM", event: "BOOT", timestamp: new Date(Date.now() - 70_000).toISOString(), latencyMs: 12, message: "AutoUni-Node 4B connected · edge mesh healthy", status: "success" },
    { id: "boot-2", nodeId: "4B", source: "SYSTEM", event: "NFC_TAP", timestamp: new Date(Date.now() - 42_000).toISOString(), latencyMs: 142, message: "ZK-NFC credential verified · student admitted", status: "success" },
    { id: "boot-3", nodeId: "4B", source: "VISION", event: "STP_APPROVED", timestamp: new Date(Date.now() - 21_000).toISOString(), latencyMs: 1800, message: "Clinic document pre-check passed · STP pipeline ready", status: "success" }
  ]
};

const quickPrompts = [
  "Swap my Thursday 8am lab to Tuesday 2pm",
  "Summarize today's Kafka lecture",
  "Show my next CS302 class"
];

const fmtTime = (value: string) => new Date(value).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const shortTime = (value: string) => new Date(value).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: false });

function Panel({ children, className = "", title, eyebrow, action }: { children: ReactNode; className?: string; title?: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <section className={`glass-panel ${className}`}>
      {(title || eyebrow || action) && (
        <div className="panel-heading">
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2 className="panel-title">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function StatusDot({ color = "green" }: { color?: "green" | "cyan" | "amber" | "rose" | "violet" }) {
  return <span className={`status-dot status-${color}`} />;
}

function Metric({ label, value, suffix, tone = "cyan", detail }: { label: string; value: string; suffix?: string; tone?: string; detail?: string }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value text-${tone}`}>{value}<span>{suffix}</span></div>
      {detail && <div className="metric-detail">{detail}</div>}
    </div>
  );
}

function BrandMark() {
  return (
    <div className="brand-wrap">
      <div className="brand-mark"><div className="brand-mark-inner"><Network size={18} /></div></div>
      <div className="brand-copy"><div className="brand-name">AutoUni <span>OS</span></div><div className="brand-sub">AUTONOMOUS CAMPUS INTELLIGENCE</div></div>
    </div>
  );
}

function ZkPass({ countdown, onTap, tapping, verified }: { countdown: number; onTap: () => void; tapping: boolean; verified: boolean }) {
  const circumference = 2 * Math.PI * 17;
  const progress = (countdown / 15) * circumference;
  const [token, setToken] = useState("0x9f84…e71b");

  useEffect(() => {
    if (countdown === 15 && typeof window !== "undefined" && window.crypto?.getRandomValues) {
      const seed = new Uint8Array(32);
      window.crypto.getRandomValues(seed);
      void window.crypto.subtle.digest("SHA-256", seed).then((digest) => {
        const hash = Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
        setToken(`0x${hash.slice(0, 4)}…${hash.slice(-4)}`);
      }).catch(() => {
        const hash = Array.from(seed, (value) => value.toString(16).padStart(2, "0")).join("");
        setToken(`0x${hash.slice(0, 4)}…${hash.slice(-4)}`);
      });
    }
  }, [countdown]);

  return (
    <div className="pass-card">
      <div className="pass-holo" />
      <div className="pass-topline"><div className="pass-brand"><div className="pass-chip"><Fingerprint size={17} /></div><span>APU DIGITAL IDENTITY</span></div><div className="pass-verified"><StatusDot color="green" /> ZK VERIFIED</div></div>
      <div className="pass-main">
        <div>
          <div className="pass-kicker">STUDENT ACCESS CREDENTIAL</div>
          <div className="pass-name">Riteikes A/L A Prakash</div>
          <div className="pass-course">CS302 <span>·</span> Distributed Systems</div>
          <div className="pass-meta"><span>TP091842</span><span>•</span><span>2026 / SEM 2</span></div>
        </div>
        <div className="countdown-wrap">
          <svg viewBox="0 0 44 44" className="countdown-ring" aria-label={`Token refresh in ${countdown} seconds`}>
            <circle cx="22" cy="22" r="17" className="ring-track" />
            <circle cx="22" cy="22" r="17" className="ring-progress" strokeDasharray={circumference} strokeDashoffset={circumference - progress} />
          </svg>
          <span className="countdown-number">{countdown}</span>
          <span className="countdown-label">SEC</span>
        </div>
      </div>
      <div className="pass-token-row"><div><div className="pass-token-label">ROTATING SHA-256 / ZK-SNARK TOKEN</div><div className="pass-token">{token}</div></div><div className="token-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
      <div className="pass-footer"><div className="pass-shield"><ShieldCheck size={13} /> BIOMETRIC-FREE · PDPA SAFE</div><span>ISSUED BY APU IDP</span></div>
      <button className={`btn btn-nfc ${tapping ? "is-loading" : ""}`} onClick={onTap} disabled={tapping}>
        {tapping ? <><Waves size={16} className="pulse-icon" /> Handshake in progress…</> : <><Radio size={16} /> Tap Classroom Gate (NFC) <span className="btn-latency">142ms</span></>}
      </button>
      {verified && <div className="inline-success"><CheckCircle2 size={14} /> Access granted · credential verified</div>}
    </div>
  );
}

function StudentView({ snapshot, emitEvent, countdown, tapping, onTap, verified, onOpenTutor }: {
  snapshot: EdgeSnapshot; emitEvent: (event: EdgeEventType) => Promise<void>; countdown: number; tapping: boolean; onTap: () => void; verified: boolean; onOpenTutor: () => void;
}) {
  const [command, setCommand] = useState("");
  const [chatReply, setChatReply] = useState("Your academic workspace is synced. Ask me to move a class, find a resource, or catch you up on a lecture.");
  const [transaction, setTransaction] = useState(false);
  const [timetable, setTimetable] = useState([
    { day: "MON", time: "10:00", title: "Cloud Computing", room: "C-05-08", type: "LECTURE" },
    { day: "TUE", time: "11:00", title: "Data Structures Tutorial", room: "B-02-05", type: "TUTORIAL" },
    { day: "WED", time: "09:00", title: "Network Security", room: "A-02-11", type: "LECTURE" },
    { day: "THU", time: "08:00", title: "Distributed Systems Tutorial", room: "B-03-02", type: "TUTORIAL" }
  ]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizTwo, setQuizTwo] = useState<string | null>(null);
  const [mcState, setMcState] = useState<"idle" | "valid" | "tampered">("idle");
  const [mcFilename, setMcFilename] = useState("Valid_Clinic_MC.pdf");
  const [scanning, setScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!snapshot.tutorActive) {
      setQuizAnswer(null);
      setQuizTwo(null);
    }
  }, [snapshot.tutorActive]);

  const runCommand = (text: string) => {
    const normalized = text.toLowerCase();
    setCommand(text);
    if (normalized.includes("swap") || normalized.includes("move") || normalized.includes("reschedule")) {
      setTimetable((rows) => rows.map((row) => row.day === "THU" && row.time === "08:00" ? { ...row, day: "TUE", time: "14:00", room: "LAB 4B" } : row));
      setChatReply("Swap validated. Your Thursday 08:00 tutorial has been moved to Tuesday 14:00 in Lab 4B. No timetable collision detected; both class groups are synchronized.");
      setTransaction(true);
      window.setTimeout(() => setTransaction(false), 6500);
    } else if (normalized.includes("summarize") || normalized.includes("summary") || normalized.includes("kafka")) {
      setChatReply("Kafka lecture recap: (1) Producers publish records to partitioned topics; brokers replicate partitions for durability. (2) Consumer groups divide partition work and track offsets, enabling replay. (3) Idempotent producers and transactions strengthen delivery guarantees. Your next step: review partition leadership and ISR failover.");
      setTransaction(false);
    } else {
      setChatReply("I found your CS302 workspace. Try a timetable swap or ask for a lecture recap. Actions are checked against your registered timetable before they are committed.");
      setTransaction(false);
    }
  };

  const scanDocument = async (valid: boolean, filename: string) => {
    setMcFilename(filename);
    setScanning(true);
    setMcState("idle");
    await new Promise((resolve) => window.setTimeout(resolve, valid ? 1100 : 850));
    setMcState(valid ? "valid" : "tampered");
    setScanning(false);
    await emitEvent(valid ? "MC_VALID" : "MC_TAMPER");
  };

  const onFileDrop = (file: File) => {
    const filename = file.name || "Uploaded_Medical_Certificate.pdf";
    scanDocument(!/tamper|alter|fake|clone/i.test(filename), filename);
  };

  const tutorReady = snapshot.tutorActive;
  const quizPassed = quizAnswer === "partition" && quizTwo === "offset";

  return (
    <div className="view-stack">
      <div className="view-intro">
        <div><div className="eyebrow"><span className="eyebrow-line" /> STUDENT EXPERIENCE / ZERO-FRICTION CAMPUS</div><h1>Your campus, <span>on autopilot.</span></h1><p>One identity. One intelligent layer. Every campus service in sync.</p></div>
        <div className="intro-meta"><span className="avatar">RP</span><div><strong>Riteikes Prakash</strong><span>School of Computing · Year 2</span></div><span className={`pill ${snapshot.attendanceStatus === "EXCUSED" ? "pill-green" : snapshot.attendanceStatus === "AT_RISK" ? "pill-amber" : "pill-cyan"}`}>{snapshot.attendanceStatus}</span><ChevronDown size={15} /></div>
      </div>

      <div className="student-grid">
        <div className="student-main-column">
          <Panel title="Digital Campus Pass" eyebrow="01 / TRUSTED IDENTITY" action={<span className="tiny-live"><StatusDot color="green" /> ROTATING TOKEN</span>}>
            <ZkPass countdown={countdown} onTap={onTap} tapping={tapping} verified={verified} />
          </Panel>

          <Panel title={tutorReady ? "Missed Lecture Remediation" : "Autonomous Study & Schedule Agent"} eyebrow={tutorReady ? "02 / PRIORITY REMEDIATION · MINUTES 36–90" : "02 / AGENTIC AI · DETERMINISTIC ACTIONS"} action={<span className={`pill ${tutorReady ? "pill-amber" : "pill-violet"}`}><Sparkles size={12} /> {tutorReady ? "TUTOR DISPATCHED" : "AGENT READY"}</span>} className={tutorReady ? "tutor-panel tutor-urgent" : "tutor-panel"}>
            {tutorReady ? (
              <div className="remediation-content">
                <div className="remediation-alert"><div className="alert-icon"><BrainCircuit size={19} /></div><div><strong>We noticed you left Lecture Hall 4B at minute 35.</strong><span>Your learning path is protected. Here is the material from minutes 36–90.</span></div><button className="text-button" onClick={onOpenTutor}>View radar <ChevronRight size={13} /></button></div>
                <div className="recap-grid">
                  <div className="recap-card"><span>01 / PARTITIONS</span><strong>Scale horizontally</strong><p>Topics split data into ordered partitions. Each partition is consumed by one member of a consumer group.</p></div>
                  <div className="recap-card"><span>02 / REPLICATION</span><strong>Resilience by design</strong><p>Leaders handle writes while followers replicate logs. In-sync replicas protect availability.</p></div>
                  <div className="recap-card"><span>03 / OFFSETS</span><strong>Control the replay</strong><p>Offsets record a consumer&apos;s progress and let an application resume or replay messages.</p></div>
                </div>
                <div className="quiz-block">
                  <div className="quiz-heading"><div><strong>2-question mastery check</strong><span>Pass both to restore your attendance standing.</span></div><span className="pill pill-amber">2 QUESTIONS</span></div>
                  <div className="quiz-question"><strong>Q1. What is the unit of parallelism within a Kafka topic?</strong><div className="quiz-options">{[{ value: "broker", label: "Broker" }, { value: "partition", label: "Partition" }, { value: "offset", label: "Offset" }].map((item) => <button key={item.value} className={`quiz-option ${quizAnswer === item.value ? "selected" : ""} ${quizAnswer && item.value === "partition" ? "correct" : ""}`} onClick={() => setQuizAnswer(item.value)}>{item.label}{quizAnswer === item.value && <Check size={13} />}</button>)}</div></div>
                  <div className="quiz-question"><strong>Q2. What helps a consumer resume from its previous position?</strong><div className="quiz-options">{[{ value: "offset", label: "Committed offset" }, { value: "topic", label: "Topic name" }, { value: "broker", label: "Broker ID" }].map((item) => <button key={item.value} className={`quiz-option ${quizTwo === item.value ? "selected" : ""} ${quizTwo && item.value === "offset" ? "correct" : ""}`} onClick={() => setQuizTwo(item.value)}>{item.label}{quizTwo === item.value && <Check size={13} />}</button>)}</div></div>
                  {quizPassed ? <div className="quiz-passed"><CheckCircle2 size={15} /> Diagnostic passed · ready to claim mastery</div> : <div className="quiz-hint">Select both correct answers to unlock your mastery badge.</div>}
                  <button className="btn btn-violet" disabled={!quizPassed} onClick={() => emitEvent("QUIZ_COMPLETE")}><BadgeCheck size={15} /> Claim ZK Mastery Badge <ArrowUpRight size={14} /></button>
                </div>
              </div>
            ) : (
              <div className="agent-layout">
                <div className="agent-chat">
                  <div className="agent-chat-top"><div className="ai-avatar"><BrainCircuit size={18} /></div><div><strong>AutoUni Agent</strong><span><StatusDot color="violet" /> Deterministic action engine online</span></div><span className="agent-model">AGENT v2.6</span></div>
                  <div className="agent-reply"><span className="reply-label">ASSISTANT / VERIFIED CONTEXT</span>{chatReply}</div>
                  <div className="prompt-chips">{quickPrompts.map((prompt) => <button key={prompt} onClick={() => runCommand(prompt)}>{prompt}<ArrowUpRight size={11} /></button>)}</div>
                  <form className="agent-input-row" onSubmit={(event) => { event.preventDefault(); if (command.trim()) runCommand(command.trim()); }}><input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Tell AutoUni what you need…" aria-label="Ask AutoUni Agent" /><button type="submit" aria-label="Send prompt"><Send size={16} /></button></form>
                  {transaction && <div className="transaction-badge"><ShieldCheck size={14} /><span><strong>TxID #8821</strong> · JSON Schema valid · Idempotency verified</span><span className="commit-time">COMMITTED</span></div>}
                </div>
                <div className="agent-side-stats"><div className="agent-stat"><span>POLICY ENGINE</span><strong><CheckCircle2 size={14} /> VALIDATED</strong><small>Collision · prerequisites · capacity</small></div><div className="agent-stat"><span>LAST ACTION</span><strong className="text-violet">{transaction ? "SWAP COMMITTED" : "NO PENDING TX"}</strong><small>Actions require deterministic validation</small></div><div className="agent-stat"><span>RESPONSE LATENCY</span><strong>184<span>ms</span></strong><small>Agentic orchestration layer</small></div></div>
              </div>
            )}
          </Panel>
        </div>

        <div className="student-side-column">
          <Panel title="Medical Certificate Scanner" eyebrow="03 / VISION · STRAIGHT-THROUGH PROCESSING" action={<span className="pill pill-cyan"><ScanLine size={12} /> 3-SEC SCAN</span>}>
            <div className={`dropzone ${isDragging ? "dropzone-active" : ""}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); const file = event.dataTransfer.files?.[0]; if (file) onFileDrop(file); }} onClick={() => fileInput.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") fileInput.current?.click(); }}>
              <input ref={fileInput} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden-input" onChange={(event) => { const file = event.target.files?.[0]; if (file) onFileDrop(file); }} />
              <div className="drop-icon"><UploadCloud size={20} /></div><strong>Drop medical certificate here</strong><span>PDF or image · encrypted in transit</span><button type="button" className="browse-link" onClick={(event) => { event.stopPropagation(); fileInput.current?.click(); }}>Browse file <ChevronRight size={12} /></button>
            </div>
            <div className="preset-label">JUDGE PRESETS <span>INSTANT SIMULATION</span></div>
            <div className="preset-buttons"><button onClick={() => scanDocument(true, "Valid_Clinic_MC.pdf")}><FileCheck2 size={14} /><span>Valid_Clinic_MC.pdf</span><Play size={11} /></button><button onClick={() => scanDocument(false, "Tampered_MC_Scan.pdf")}><FileSearch size={14} /><span>Tampered_MC_Scan.pdf</span><Play size={11} /></button></div>
            <div className="document-preview">
              <div className="document-window-top"><span><span className="doc-dot" /> {scanning ? "VISION ENGINE ANALYZING" : mcState === "idle" ? "DOCUMENT PREVIEW" : "FORENSIC OVERLAY"}</span><span>MM / DD / YYYY</span></div>
              <div className={`fake-document ${mcState === "tampered" ? "doc-invalid" : ""}`}>
                <div className="doc-letterhead"><div className="doc-clinic-seal"><PlusMark /></div><div><strong>KLINIK KESIHATAN BUKIT JALIL</strong><span>MINISTRY OF HEALTH MALAYSIA</span><small>Jalan 1/155B, Bukit Jalil, 57000 Kuala Lumpur</small></div></div>
                <div className="doc-title">MEDICAL CERTIFICATE</div>
                <div className="doc-line"><span>Patient Name</span><b>Riteikes A/L A Prakash</b></div><div className="doc-line"><span>Identification No.</span><b>••••••-••-4821</b></div><div className="doc-line"><span>Date of Consultation</span><b className={mcState === "tampered" ? "altered-date" : ""}>12 November 2026</b></div><div className="doc-line"><span>Medical Leave</span><b>1 day · 12/11/2026</b></div>
                <div className="doc-doctor"><span>Dr. N. S. Kumar</span><span>MMC: 78452</span></div><div className="doc-signature">N.S.Kumar</div>
                {mcState !== "idle" && !scanning && <><div className="bbox bbox-seal"><span>CLINIC SEAL · 99.1%</span></div><div className="bbox bbox-registry"><span>MMC ID · VERIFIED</span></div><div className={`bbox bbox-date ${mcState === "tampered" ? "bbox-danger" : ""}`}><span>{mcState === "valid" ? "ISSUE DATE · VERIFIED" : "CLONE-STAMP · 94.2%"}</span></div></>}
                {scanning && <div className="scan-beam" />}
              </div>
              <div className="doc-file-label"><FileText size={12} /> {mcFilename}</div>
            </div>
            {scanning ? <div className="scan-status"><span className="spinner" /> Running seal, registry and metadata checks…</div> : mcState === "valid" ? <div className="scan-result result-valid"><div className="result-icon"><CheckCircle2 size={17} /></div><div><strong>STP APPROVED · 1.8s</strong><span>Official seal + MMC registry verified. Attendance status set to EXCUSED.</span></div><span className="pill pill-green">EXCUSED</span></div> : mcState === "tampered" ? <div className="scan-result result-invalid"><div className="result-icon"><ShieldAlert size={17} /></div><div><strong>HUMAN REVIEW REQUIRED</strong><span>Clone-stamp anomaly detected: 94.2% tamper probability.</span></div><span className="pill pill-rose">FLAGGED</span></div> : <div className="scanner-footnote"><LockKeyhole size={12} /> Privacy-first scan · no biometric data collected</div>}
          </Panel>

          <Panel title="My timetable" eyebrow="LIVE SCHEDULE · SEMESTER 2" action={<button className="icon-button" aria-label="Calendar"><CalendarClock size={15} /></button>}>
            <div className="timetable-list">{timetable.map((item, index) => <div className={`timetable-row ${item.day === "TUE" && item.time === "14:00" ? "timetable-moved" : ""}`} key={`${item.day}-${item.time}-${index}`}><div className="schedule-day"><strong>{item.day}</strong><span>{item.time}</span></div><div className="schedule-content"><strong>{item.title}</strong><span><Building2 size={11} /> {item.room}</span></div><span className={`schedule-type ${item.type === "LAB" ? "type-lab" : ""}`}>{item.type}</span></div>)}</div>
            <div className="timetable-note"><span><StatusDot color="green" /> Synced with APU SIS</span><span>Updated just now</span></div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function PlusMark() { return <span className="plus-mark">+</span>; }

function SeatMap({ occupancy }: { occupancy: number }) {
  const seats = Array.from({ length: 42 }, (_, index) => index);
  return (
    <div className="floorplan-shell">
      <div className="floorplan-top"><span>LECTURE HALL 4B / SPATIAL OCCUPANCY</span><span><StatusDot color="cyan" /> LIVE BLE RSSI MESH</span></div>
      <div className="floorplan-stage">
        <div className="floorplan-screen"><span>FRONT WALL / SMART DISPLAY</span></div>
        <div className="seat-grid">{seats.map((seat) => <div key={seat} className={`seat ${seat < occupancy ? "seat-occupied" : "seat-empty"}`} title={`Seat ${seat + 1}: ${seat < occupancy ? "occupied" : "empty"}`}><span>{seat + 1}</span></div>)}</div>
        <div className="doorway-zone"><div className="door-line" /><div className="door-sensor"><Radio size={15} /><span>IR / BLE EXIT ZONE</span></div><div className="signal-arcs"><i /><i /><i /></div></div>
        <div className="floorplan-legend"><span><i className="legend-seat occupied" /> Occupied</span><span><i className="legend-seat empty" /> Empty</span><span><i className="legend-pulse" /> Sensor range</span></div>
      </div>
      <div className="floorplan-bottom"><div><strong>{occupancy.toString().padStart(2, "0")} / 42</strong><span>Occupied seats</span></div><div><strong>{42 - occupancy}</strong><span>Vacant seats</span></div><div><strong>−61 <small>dBm</small></strong><span>Median BLE RSSI</span></div><div><strong>98.7<small>%</small></strong><span>Sensor confidence</span></div></div>
    </div>
  );
}

function LecturerView({ snapshot, onOps }: { snapshot: EdgeSnapshot; onOps: () => void }) {
  const [selectedStudent, setSelectedStudent] = useState("Riteikes A/L A Prakash");
  const riskBars = [
    { label: "Early Exit at Min 35", value: snapshot.earlyExitMinute ? 22 : 0, sign: "+", color: "rose", note: "Strongest risk driver" },
    { label: "Quiz 2 Score", value: 8, sign: "−", color: "green", note: "Protective academic signal" },
    { label: "AI Catch-Up Completed", value: snapshot.tutorActive ? 0 : 24, sign: "−", color: "violet", note: "Mastery path contribution" }
  ];
  return (
    <div className="view-stack">
      <div className="view-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> LECTURER CONSOLE / PRIVACY-SAFE ACCOUNTABILITY</div><h1>See the room. <span>Not the faces.</span></h1><p>Presence intelligence built on directional sensors, not surveillance.</p></div><div className="radar-status"><div className="radar-wave"><Radio size={19} /></div><div><strong>HALL 4B LIVE</strong><span>Sensor mesh active · 2s sync</span></div></div></div>

      <div className="lecturer-stats"><Metric label="PRESENT NOW" value={String(snapshot.occupancy || 41)} suffix=" / 42" tone="cyan" detail="IR + BLE sensor fusion" /><Metric label="FULL-SESSION ATTENDANCE" value="41" suffix=" students" tone="green" detail="90 / 90 minutes" /><Metric label="EARLY EXIT EVENTS" value={snapshot.earlyExitMinute ? "1" : "0"} tone={snapshot.earlyExitMinute ? "amber" : "green"} detail={snapshot.earlyExitMinute ? "Minute 35 · tutor dispatched" : "No early departures detected"} /><Metric label="CAMERA / BIOMETRIC" value="0" tone="green" detail="PDPA-first · no face recognition" /></div>

      <div className="lecturer-grid">
        <Panel title="Classroom spatial radar" eyebrow="01 / REAL-TIME PRESENCE MAP" action={<span className="tiny-live"><StatusDot color="cyan" /> STREAMING</span>} className="radar-panel"><SeatMap occupancy={snapshot.occupancy} /></Panel>
        <Panel title="Explainable AI · risk drivers" eyebrow="02 / SHAP ATTRITION EARLY WARNING" action={<span className="pill pill-violet"><BrainCircuit size={12} /> SHAP MODEL</span>}>
          <div className="risk-student-select"><div className="risk-avatar">RP</div><div><strong>{selectedStudent}</strong><span>TP091842 · CS302 Distributed Systems</span></div><button className="select-student" onClick={() => setSelectedStudent(selectedStudent === "Riteikes A/L A Prakash" ? "Aina Binti Rahman" : "Riteikes A/L A Prakash")}>Switch student <ChevronDown size={12} /></button></div>
          <div className="risk-score-row"><div><span>LIVE ATTRITION RISK</span><strong className={snapshot.riskScore > 60 ? "risk-high" : "risk-low"}>{snapshot.riskScore}<small>/100</small></strong></div><div className="risk-gauge"><div className="risk-gauge-fill" style={{ width: `${snapshot.riskScore}%` }} /></div><span className={`risk-level ${snapshot.riskScore > 60 ? "level-high" : "level-low"}`}>{snapshot.riskScore > 60 ? "ELEVATED" : "STABLE"}</span></div>
          <div className="shap-list">{riskBars.map((bar) => <div className="shap-row" key={bar.label}><div className="shap-label"><span>{bar.label}</span><strong className={`text-${bar.color}`}>{bar.sign}{bar.value}%</strong></div><div className="shap-track"><div className={`shap-fill shap-${bar.color}`} style={{ width: `${Math.max(bar.value, 2)}%` }} /></div><small>{bar.note}</small></div>)}</div>
          <div className="model-explain"><ShieldCheck size={14} /><span>Model explanation is attached to every risk change. No protected traits or biometric features are used.</span></div>
          <button className="btn btn-subtle full-width" onClick={onOps}>Open intervention audit <ArrowUpRight size={14} /></button>
        </Panel>
      </div>

      <Panel title="Presence & intervention timeline" eyebrow="03 / CLASS SESSION · 09:00–10:30" action={<span className="tiny-live"><span className="pulse-mini" /> LIVE SESSION</span>}>
        <div className="session-timeline">
          <div className="timeline-track"><div className="timeline-progress" style={{ width: snapshot.earlyExitMinute ? "39%" : "100%" }} /><div className="timeline-point point-start"><span>09:00</span><i /></div><div className={`timeline-point point-exit ${snapshot.earlyExitMinute ? "point-active" : ""}`}><span>09:35</span><i /></div><div className={`timeline-point point-tutor ${snapshot.tutorActive ? "point-active" : ""}`}><span>09:36</span><i /></div><div className="timeline-point point-end"><span>10:30</span><i /></div></div>
          <div className="timeline-cards"><div><span className="timeline-card-time">09:00 · MIN 00</span><strong>Class started</strong><small>42 enrolled · sensor baseline captured</small></div><div className={snapshot.earlyExitMinute ? "timeline-card-alert" : ""}><span className="timeline-card-time">09:35 · MIN 35</span><strong>{snapshot.earlyExitMinute ? "Early exit detected" : "Exit monitoring"}</strong><small>{snapshot.earlyExitMinute ? "Student departed via IR / BLE doorway zone" : "No anomaly · directional beam active"}</small></div><div className={snapshot.tutorActive ? "timeline-card-tutor" : ""}><span className="timeline-card-time">09:36 · MIN 36</span><strong>{snapshot.tutorActive ? "AI tutor dispatched" : "Remediation standby"}</strong><small>{snapshot.tutorActive ? "Concept recap + 2-question diagnostic generated" : "Catch-up support triggers on verified exit"}</small></div><div><span className="timeline-card-time">10:30 · MIN 90</span><strong>Session closes</strong><small>Attendance ledger reconciliation</small></div></div>
        </div>
      </Panel>
      <div className="privacy-strip"><div className="privacy-icon"><Shield size={17} /></div><div><strong>Privacy by architecture</strong><span>AutoUni OS uses directional IR break-beams and BLE signal strength to infer room presence. No cameras, facial recognition, voiceprints, or continuous biometric identifiers.</span></div><span className="pill pill-green">PDPA-FIRST DESIGN</span></div>
    </div>
  );
}

function OpsView({ snapshot, emitEvent }: { snapshot: EdgeSnapshot; emitEvent: (event: EdgeEventType) => Promise<void> }) {
  const wattage = snapshot.hvacOn || snapshot.lightingOn ? 1.4 : 0.05;
  const [ledgerExpanded, setLedgerExpanded] = useState(false);
  return (
    <div className="view-stack">
      <div className="view-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> CAMPUS OPERATIONS / EDGE TELEMETRY & GOVERNANCE</div><h1>One campus. <span>One control plane.</span></h1><p>Physical infrastructure, AI decisions and compliance evidence — unified.</p></div><div className="node-online"><span className="node-orbit"><Cpu size={19} /></span><div><strong>AUTO-UNI NODE v1</strong><span><StatusDot color="green" /> NODE-4B ONLINE</span></div></div></div>

      <div className="ops-stats"><Metric label="LIVE POWER DRAW" value={wattage.toFixed(2)} suffix=" kW" tone="cyan" detail={wattage < 0.1 ? "Standby · 96.4% lower draw" : "Active classroom profile"} /><Metric label="ROOM OCCUPANCY" value={String(snapshot.occupancy).padStart(2, "0")} suffix=" / 42" tone="green" detail="IR break-beam + BLE fusion" /><Metric label="ENERGY SAVED" value="25.4" suffix="%" tone="green" detail="Compared with fixed HVAC schedule" /><Metric label="EDGE ROUND-TRIP" value={`${snapshot.lastLatencyMs}`} suffix=" ms" tone="violet" detail="Latest accepted event" /></div>

      <div className="ops-grid">
        <Panel title="AutoUni-Node v1 · hardware mesh" eyebrow="01 / ESP32-S3 RETROFIT CONTROLLER" action={<span className="pill pill-cyan"><Wifi size={12} /> MESH CONNECTED</span>} className="hardware-panel">
          <div className="hardware-visual">
            <div className="board-glow" /><div className="esp-board"><div className="board-screw screw-a" /><div className="board-screw screw-b" /><div className="board-screw screw-c" /><div className="board-screw screw-d" /><div className="board-chip"><Cpu size={29} /><strong>ESP32-S3</strong><span>DUAL-CORE MCU</span></div><div className="board-usb" /><div className="board-pin-row"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="board-antenna"><Waves size={24} /></div><div className="board-led led-green" /><div className="board-led led-cyan" /></div>
            <div className="hardware-callout callout-left"><span>GPIO 18 / 19</span><strong>IR + BLE INPUT</strong></div><div className="hardware-callout callout-right"><span>GPIO 25 / 26</span><strong>RELAY OUTPUT</strong></div>
          </div>
          <div className="board-meta"><span><span className="meta-dot green" /> ESP32-S3 WROOM</span><span><span className="meta-dot cyan" /> WI-FI 2.4 GHZ</span><span><span className="meta-dot violet" /> MQTT / HTTP</span><span className="board-price">$8 RETROFIT NODE</span></div>
          <div className="relay-control-grid">
            <div className={`relay-control ${snapshot.hvacOn ? "relay-on" : "relay-off"}`}><div className="relay-icon"><Heater size={17} /></div><div><strong>HVAC Relay</strong><span>{snapshot.hvacOn ? "ACTIVE · COMFORT MODE" : "STANDBY · ENERGY SAVE"}</span></div><button className={`toggle ${snapshot.hvacOn ? "toggle-on" : ""}`} role="switch" aria-checked={snapshot.hvacOn} aria-label="Toggle HVAC relay" onClick={() => emitEvent(snapshot.hvacOn ? "HVAC_OFF" : "HVAC_ON")}><i /></button></div>
            <div className={`relay-control ${snapshot.lightingOn ? "relay-on" : "relay-off"}`}><div className="relay-icon"><Lightbulb size={17} /></div><div><strong>Lighting Relay</strong><span>{snapshot.lightingOn ? "ACTIVE · 100% OUTPUT" : "STANDBY · OFF"}</span></div><button className={`toggle ${snapshot.lightingOn ? "toggle-on" : ""}`} role="switch" aria-checked={snapshot.lightingOn} aria-label="Toggle lighting relay" onClick={() => emitEvent(snapshot.lightingOn ? "LIGHTS_OFF" : "LIGHTS_ON")}><i /></button></div>
          </div>
          <div className="power-meter"><div className="power-meter-top"><span>REAL-TIME LOAD PROFILE</span><strong>{wattage.toFixed(2)} kW</strong></div><div className="power-track"><div className="power-fill" style={{ width: `${Math.max(3, wattage / 1.4 * 100)}%` }} /></div><div className="power-meter-bottom"><span>0.05 kW STANDBY</span><span>1.40 kW ACTIVE</span></div></div>
        </Panel>

        <Panel title="Event bus · live stream" eyebrow="02 / KAFKA-STYLE TELEMETRY PIPELINE" action={<span className="tiny-live"><span className="pulse-mini" /> LIVE TAIL</span>} className="event-panel">
          <div className="terminal-top"><div className="terminal-lights"><i /><i /><i /></div><span>autouni-edge / events.log</span><MoreHorizontal size={15} /></div>
          <div className="terminal-body" aria-live="polite">{snapshot.events.slice(0, 9).map((entry) => <div className="log-line" key={entry.id}><span className="log-time">{fmtTime(entry.timestamp)}</span><span className={`log-source source-${entry.source.toLowerCase()}`}>[{entry.source === "ESP32" || entry.source === "SIMULATOR" ? "NODE-4B" : entry.source === "VISION" ? "IDP-VISION" : entry.source === "AI_TUTOR" ? "AI-TUTOR" : "ZK-AUTH"}]</span><span className="log-message">{entry.message}</span><span className={`log-latency ${entry.status}`}>{entry.latencyMs >= 1000 ? `${(entry.latencyMs / 1000).toFixed(1)}s` : `${entry.latencyMs}ms`}</span></div>)}<div className="terminal-cursor"><span /> waiting for next event…</div></div>
          <div className="terminal-footer"><span><StatusDot color="green" /> CONSUMER CONNECTED</span><span>PARTITION 04 · OFFSET 8,421,092</span></div>
        </Panel>
      </div>

      <Panel title="Immutable ZK audit ledger" eyebrow="03 / GOVERNANCE · PROVABLE EVENT HISTORY" action={<button className="text-button" onClick={() => setLedgerExpanded(!ledgerExpanded)}>{ledgerExpanded ? "Collapse" : "View ledger"} <ChevronRight size={13} /></button>}>
        <div className="ledger-summary"><div className="ledger-hash-icon"><LockKeyhole size={18} /></div><div><strong>Audit chain integrity verified</strong><span>Each event is chained to a previous digest; sensitive student attributes are not written to the audit stream.</span></div><div className="ledger-hash"><span>LATEST MERKLE ROOT</span><strong>0x8c41…d9a7</strong></div><span className="pill pill-green"><ShieldCheck size={12} /> VERIFIED</span></div>
        <div className="ledger-table"><div className="ledger-head"><span>EVENT / SOURCE</span><span>TIMESTAMP</span><span>EXECUTION</span><span>INTEGRITY</span></div>{snapshot.events.slice(0, ledgerExpanded ? 12 : 4).map((entry) => <div className="ledger-row" key={`ledger-${entry.id}`}><span><i className={`ledger-event-dot ${entry.status}`} /><span><strong>{entry.event}</strong><small>{entry.source} · NODE-{entry.nodeId}</small></span></span><span>{fmtTime(entry.timestamp)}</span><span>{entry.latencyMs >= 1000 ? `${(entry.latencyMs / 1000).toFixed(1)}s` : `${entry.latencyMs}ms`}</span><span className="integrity-ok"><CheckCircle2 size={12} /> CHAINED</span></div>)}</div>
      </Panel>
      <div className="ops-footnote"><div><Zap size={15} /><strong>Built for retrofit, not rip-and-replace.</strong><span>AutoUni-Node extends existing campus infrastructure using low-cost ESP32-S3 edge hardware.</span></div><span>TEAM THE CLOUD ENGINEERS · APU SDC HACKATHON</span></div>
    </div>
  );
}

function SimulatorDock({ onTrigger, busy, storyStep, collapsed, setCollapsed, onStory }: { onTrigger: (event: EdgeEventType) => void; busy: boolean; storyStep: number; collapsed: boolean; setCollapsed: (value: boolean) => void; onStory: () => void }) {
  const storyLabels = ["Ready for live walkthrough", "Step 1 · <200ms NFC entry", "Step 2 · IR / BLE early exit", "Step 3 · AI catch-up quiz generated", "Step 4 · Empty-room energy cut"];
  return (
    <div className={`sim-dock ${collapsed ? "dock-collapsed" : ""}`}>
      <div className="dock-header"><div className="dock-brand"><div className="dock-zap"><Zap size={15} fill="currentColor" /></div><div><strong>Judge Mode <span>· LIVE EVENT SIMULATOR</span></strong><small>{busy ? storyLabels[storyStep] : "Trigger the full campus intelligence loop"}</small></div></div><div className="dock-header-actions"><span className="dock-live"><i /> READY</span><button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand simulator" : "Collapse simulator"}>{collapsed ? <ChevronDown size={16} /> : <Minus size={16} />}</button></div></div>
      {!collapsed && <><div className="dock-actions"><button className="story-button" onClick={onStory} disabled={busy}><Play size={14} fill="currentColor" /><span>Auto-Play Full Story</span><small>15s</small></button><button onClick={() => onTrigger("NFC_TAP")} disabled={busy}><span className="dock-step step-cyan">1</span><span>NFC Tap Entry</span><small>142ms</small></button><button onClick={() => onTrigger("EARLY_EXIT")} disabled={busy}><span className="dock-step step-amber">2</span><span>Early Exit → AI Tutor</span><small>IR / BLE</small></button><button onClick={() => onTrigger("ROOM_EMPTY")} disabled={busy}><span className="dock-step step-green">3</span><span>Empty Room Energy Cut</span><small>−25.4% kWh</small></button></div>{busy && <div className="story-progress"><div className="story-progress-track"><div style={{ width: `${storyStep * 25}%` }} /></div><span>{storyStep}/4</span></div>}</>}
    </div>
  );
}

export default function HomePage() {
  const [persona, setPersona] = useState<Persona>("student");
  const [snapshot, setSnapshot] = useState<EdgeSnapshot>(initialSnapshot);
  const [serverConnected, setServerConnected] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [tapping, setTapping] = useState(false);
  const [verified, setVerified] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [storyBusy, setStoryBusy] = useState(false);
  const pollBusy = useRef(false);

  const syncFromServer = useCallback(async () => {
    if (pollBusy.current) return;
    pollBusy.current = true;
    try {
      const response = await fetch("/api/edge-event", { cache: "no-store" });
      if (!response.ok) throw new Error("API unavailable");
      const data = (await response.json()) as EdgeSnapshot;
      setSnapshot(data);
      setServerConnected(true);
    } catch {
      setServerConnected(false);
    } finally {
      pollBusy.current = false;
    }
  }, []);

  useEffect(() => {
    void syncFromServer();
    const poll = window.setInterval(() => void syncFromServer(), 2000);
    return () => window.clearInterval(poll);
  }, [syncFromServer]);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown((current) => current <= 1 ? 15 : current - 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const emitEvent = useCallback(async (event: EdgeEventType) => {
    const source = "SIMULATOR" as const;
    try {
      const response = await fetch("/api/edge-event", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AutoUni-Simulator": "true" },
        body: JSON.stringify({ nodeId: "4B", event })
      });
      if (!response.ok) throw new Error("Simulator API is disabled or unavailable");
      const data = await response.json() as { snapshot: EdgeSnapshot };
      setSnapshot(data.snapshot);
      setServerConnected(true);
    } catch {
      // Local fallback keeps the pitch simulator usable if a serverless instance is cold or offline.
      setSnapshot((previous) => {
        const timestamp = new Date().toISOString();
        const latencyMs = event === "NFC_TAP" ? 142 : event === "EARLY_EXIT" ? 38 : event === "ROOM_EMPTY" ? 64 : 95;
        let next = { ...previous, event, timestamp, eventId: `local-${Date.now()}`, lastLatencyMs: latencyMs };
        let message = "Event accepted by local simulator";
        let status: AuditEvent["status"] = "info";
        if (event === "NFC_TAP" || event === "ROOM_OCCUPIED") { next = { ...next, occupancy: 42, hvacOn: true, lightingOn: true, tutorActive: false, attendanceStatus: "PRESENT", earlyExitMinute: null }; message = "ZK-NFC handshake verified · relays active"; status = "success"; }
        if (event === "EARLY_EXIT") { next = { ...next, occupancy: Math.max(0, previous.occupancy - 1), tutorActive: true, attendanceStatus: "AT_RISK", earlyExitMinute: 35, riskScore: Math.min(99, previous.riskScore + 22) }; message = "Directional IR + BLE detected early departure · tutor dispatched"; status = "warning"; }
        if (event === "ROOM_EMPTY") { next = { ...next, occupancy: 0, hvacOn: false, lightingOn: false }; message = "Room empty · HVAC and lighting relays moved to standby"; status = "success"; }
        if (event === "MC_VALID") { next = { ...next, attendanceStatus: "EXCUSED", tutorActive: false, riskScore: Math.max(12, previous.riskScore - 18) }; message = "Clinic MC verified · STP approved · attendance EXCUSED"; status = "success"; }
        if (event === "MC_TAMPER") { message = "Clone-stamp anomaly detected · forensic queue escalated"; status = "danger"; }
        if (event === "QUIZ_COMPLETE") { next = { ...next, tutorActive: false, attendanceStatus: "PRESENT", riskScore: Math.max(12, previous.riskScore - 24) }; message = "Catch-up quiz passed · mastery badge claimed"; status = "success"; }
        if (event === "HVAC_ON") next.hvacOn = true;
        if (event === "HVAC_OFF") next.hvacOn = false;
        if (event === "LIGHTS_ON") next.lightingOn = true;
        if (event === "LIGHTS_OFF") next.lightingOn = false;
        if (event === "RESET") next = { ...initialSnapshot, timestamp, events: initialSnapshot.events };
        const entry: AuditEvent = { id: `local-${Date.now()}`, nodeId: "4B", source, event, timestamp, latencyMs, message, status };
        next.events = [entry, ...previous.events].slice(0, 40);
        return next;
      });
    }
  }, []);

  const tapNfc = async () => {
    setTapping(true);
    setVerified(false);
    await emitEvent("NFC_TAP");
    await new Promise((resolve) => window.setTimeout(resolve, 950));
    setTapping(false);
    setVerified(true);
    window.setTimeout(() => setVerified(false), 5000);
  };

  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const runStory = async () => {
    if (storyBusy) return;
    setStoryBusy(true);
    setStoryStep(1);
    setPersona("student");
    await emitEvent("NFC_TAP");
    await wait(4200);
    setStoryStep(2);
    setPersona("lecturer");
    await emitEvent("EARLY_EXIT");
    await wait(4200);
    setStoryStep(3);
    setPersona("student");
    await wait(4200);
    setStoryStep(4);
    setPersona("ops");
    await emitEvent("ROOM_EMPTY");
    await wait(2200);
    setStoryBusy(false);
    setStoryStep(0);
  };

  const personaMeta = useMemo(() => ({
    student: { label: "Student Portal", status: "LEARNING EXPERIENCE" },
    lecturer: { label: "Lecturer Live Radar", status: "CLASSROOM INTELLIGENCE" },
    ops: { label: "Campus Ops & Audit", status: "INFRASTRUCTURE CONTROL" }
  }[persona]), [persona]);

  return (
    <main className="app-shell">
      <div className="ambient ambient-a" /><div className="ambient ambient-b" />
      <header className="topbar">
        <div className="topbar-left"><BrandMark /><div className="telemetry-pills"><span><i className="telemetry-dot dot-green" /> KAFKA EVENT BUS <b>14,200 msg/s</b></span><span><i className="telemetry-dot dot-cyan" /> PDPA ZERO-BIOMETRIC <b>ACTIVE</b></span><span><i className="telemetry-dot dot-violet" /> ESP32 MESH <b>200 NODES</b></span></div></div>
        <nav className="persona-switcher" aria-label="Dashboard views"><button className={persona === "student" ? "persona-active" : ""} onClick={() => setPersona("student")}><GraduationCap size={15} /><span>Student Portal</span></button><button className={persona === "lecturer" ? "persona-active" : ""} onClick={() => setPersona("lecturer")}><Users size={15} /><span>Lecturer Radar</span></button><button className={persona === "ops" ? "persona-active" : ""} onClick={() => setPersona("ops")}><Building2 size={15} /><span>Campus Ops</span></button></nav>
        <div className="topbar-right"><div className="roi-counter"><span>STP LATENCY</span><strong>1.8<span>s</span></strong></div><div className="roi-counter"><span>NFC ENTRY</span><strong>142<span>ms</span></strong></div><div className="roi-counter roi-energy"><span>HVAC SAVED</span><strong>25.4<span>%</span></strong></div><div className="system-indicator"><StatusDot color={serverConnected ? "green" : "amber"} /><span>{serverConnected ? "API LIVE" : "LOCAL MODE"}</span></div></div>
      </header>

      <div className="subbar"><div><span className="subbar-path">MISSION CONTROL</span><ChevronRight size={12} /><span>{personaMeta.status}</span><span className="subbar-separator">/</span><strong>{personaMeta.label}</strong></div><div className="subbar-right"><span><Clock3 size={12} /> 13 NOV 2026</span><span><StatusDot color="green" /> SYSTEM NOMINAL</span></div></div>

      <div className="main-content">
        {persona === "student" && <StudentView snapshot={snapshot} emitEvent={emitEvent} countdown={countdown} tapping={tapping} onTap={tapNfc} verified={verified} onOpenTutor={() => setPersona("lecturer")} />}
        {persona === "lecturer" && <LecturerView snapshot={snapshot} onOps={() => setPersona("ops")} />}
        {persona === "ops" && <OpsView snapshot={snapshot} emitEvent={emitEvent} />}
      </div>

      <footer className="app-footer"><div><span className="footer-brand">AUTO<span>UNI</span> OS</span><span>Autonomous University Operating System</span></div><span>DESIGNED & ENGINEERED BY <strong>THE CLOUD ENGINEERS</strong></span><span>APU SDC HACKATHON · INTELLIGENT AUTOMATION & DIGITAL TRANSFORMATION</span></footer>
      <SimulatorDock onTrigger={(event) => void emitEvent(event)} busy={storyBusy} storyStep={storyStep} collapsed={dockCollapsed} setCollapsed={setDockCollapsed} onStory={() => void runStory()} />
    </main>
  );
}
