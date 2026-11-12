import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuditEvent, EdgeEventType, EdgeSnapshot } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_SECRET = "autouni2026";
const ALLOWED_EVENTS: EdgeEventType[] = [
  "NFC_TAP",
  "EARLY_EXIT",
  "ROOM_EMPTY",
  "ROOM_OCCUPIED",
  "MC_VALID",
  "MC_TAMPER",
  "QUIZ_COMPLETE",
  "RESET",
  "HVAC_ON",
  "HVAC_OFF",
  "LIGHTS_ON",
  "LIGHTS_OFF"
];

type Store = { snapshot: EdgeSnapshot };

declare global {
  // eslint-disable-next-line no-var
  var __autouniStore: Store | undefined;
}

function createInitialSnapshot(): EdgeSnapshot {
  const now = new Date().toISOString();
  const starterEvents: AuditEvent[] = [
    {
      id: "evt-boot-001",
      nodeId: "4B",
      source: "SYSTEM",
      event: "BOOT",
      timestamp: now,
      latencyMs: 12,
      message: "AutoUni-Node 4B connected · edge mesh healthy",
      status: "success"
    },
    {
      id: "evt-zk-002",
      nodeId: "4B",
      source: "SYSTEM",
      event: "NFC_TAP",
      timestamp: new Date(Date.now() - 18_000).toISOString(),
      latencyMs: 142,
      message: "ZK-NFC credential verified · student admitted",
      status: "success"
    }
  ];

  return {
    nodeId: "4B",
    event: "BOOT",
    timestamp: now,
    eventId: "evt-boot-001",
    occupancy: 42,
    hvacOn: true,
    lightingOn: true,
    energySavedPercent: 25.4,
    lastLatencyMs: 142,
    riskScore: 46,
    tutorActive: false,
    attendanceStatus: "PRESENT",
    earlyExitMinute: null,
    events: starterEvents
  };
}

function getStore(): Store {
  if (!globalThis.__autouniStore) {
    globalThis.__autouniStore = { snapshot: createInitialSnapshot() };
  }
  return globalThis.__autouniStore;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-AutoUni-Simulator"
    }
  });
}

export async function GET() {
  return json(getStore().snapshot);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-AutoUni-Simulator",
      "Access-Control-Max-Age": "86400"
    }
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Request body must be valid JSON." }, 400);
  }

  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "A JSON object is required." }, 400);
  }

  const payload = body as Record<string, unknown>;
  const nodeId = typeof payload.nodeId === "string" ? payload.nodeId.trim().slice(0, 32) : "";
  const event = payload.event;
  const isSimulator = request.headers.get("x-autouni-simulator") === "true";
  const simulatorAllowed = process.env.ALLOW_DEMO_SIMULATOR !== "false";
  const configuredSecret = process.env.EDGE_EVENT_SECRET || DEMO_SECRET;

  if (!nodeId) return json({ ok: false, error: "nodeId is required." }, 400);
  if (typeof event !== "string" || !ALLOWED_EVENTS.includes(event as EdgeEventType)) {
    return json({ ok: false, error: `event must be one of: ${ALLOWED_EVENTS.join(", ")}.` }, 400);
  }
  if (isSimulator && !simulatorAllowed) {
    return json({ ok: false, error: "Public simulator events are disabled." }, 403);
  }
  if (!isSimulator && payload.secret !== configuredSecret) {
    return json({ ok: false, error: "Unauthorized edge node. Check the shared secret." }, 401);
  }

  const store = getStore();
  const previous = store.snapshot;
  const timestamp = new Date().toISOString();
  const eventId = `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const latencyMs = event === "NFC_TAP" ? 142 : event === "EARLY_EXIT" ? 38 : event === "ROOM_EMPTY" ? 64 : 95;
  let next: EdgeSnapshot = {
    ...previous,
    nodeId,
    event: event as EdgeEventType,
    timestamp,
    eventId,
    lastLatencyMs: latencyMs
  };
  const source: AuditEvent["source"] = isSimulator ? "SIMULATOR" : "ESP32";
  let audit: AuditEvent = {
    id: eventId,
    nodeId,
    source,
    event: event as EdgeEventType,
    timestamp,
    latencyMs,
    message: "Edge event accepted",
    status: "info"
  };

  switch (event as EdgeEventType) {
    case "NFC_TAP":
      next = {
        ...next,
        occupancy: Math.max(previous.occupancy, 42),
        hvacOn: true,
        lightingOn: true,
        tutorActive: false,
        attendanceStatus: "PRESENT",
        earlyExitMinute: null
      };
      audit = {
        id: eventId, nodeId, source, event: "NFC_TAP", timestamp, latencyMs,
        message: "ZK-NFC handshake verified · classroom access granted · relays active",
        status: "success"
      };
      break;
    case "EARLY_EXIT":
      next = {
        ...next,
        occupancy: Math.max(0, previous.occupancy - 1),
        riskScore: Math.min(99, Math.max(previous.riskScore, 46) + (previous.tutorActive ? 0 : 22)),
        tutorActive: true,
        attendanceStatus: "AT_RISK",
        earlyExitMinute: 35
      };
      audit = {
        id: eventId, nodeId, source, event: "EARLY_EXIT", timestamp, latencyMs,
        message: "Directional IR + BLE zone detected departure at minute 35 · remediation dispatched",
        status: "warning"
      };
      break;
    case "ROOM_EMPTY":
      next = {
        ...next,
        occupancy: 0,
        hvacOn: false,
        lightingOn: false,
        energySavedPercent: 25.4,
        tutorActive: previous.tutorActive,
      };
      audit = {
        id: eventId, nodeId, source, event: "ROOM_EMPTY", timestamp, latencyMs,
        message: "Occupancy threshold reached 0 · HVAC + lighting relays switched to standby",
        status: "success"
      };
      break;
    case "ROOM_OCCUPIED":
      next = { ...next, occupancy: 42, hvacOn: true, lightingOn: true };
      audit = {
        id: eventId, nodeId, source, event: "ROOM_OCCUPIED", timestamp, latencyMs,
        message: "Presence zone active · comfort systems enabled for Lecture Hall 4B",
        status: "success"
      };
      break;
    case "MC_VALID":
      next = { ...next, attendanceStatus: "EXCUSED", tutorActive: false, riskScore: Math.max(12, previous.riskScore - 18) };
      audit = {
        id: eventId, nodeId, source: "VISION", event: "STP_APPROVED", timestamp, latencyMs: 1800,
        message: "MMC registry + clinic seal verified · STP approved · attendance EXCUSED",
        status: "success"
      };
      break;
    case "MC_TAMPER":
      audit = {
        id: eventId, nodeId, source: "VISION", event: "MC_TAMPER", timestamp, latencyMs: 740,
        message: "Clone-stamp anomaly detected · 94.2% tamper probability · human review required",
        status: "danger"
      };
      break;
    case "QUIZ_COMPLETE":
      next = { ...next, tutorActive: false, attendanceStatus: "PRESENT", riskScore: Math.max(12, previous.riskScore - 24) };
      audit = {
        id: eventId, nodeId, source: "AI_TUTOR", event: "QUIZ_COMPLETE", timestamp, latencyMs: 320,
        message: "Catch-up diagnostic passed · mastery recorded · risk score normalized",
        status: "success"
      };
      break;
    case "HVAC_ON":
      next = { ...next, hvacOn: true };
      audit = { id: eventId, nodeId, source, event: "RELAY_UPDATED", timestamp, latencyMs, message: "HVAC relay switched ON by campus operations", status: "success" };
      break;
    case "HVAC_OFF":
      next = { ...next, hvacOn: false };
      audit = { id: eventId, nodeId, source, event: "RELAY_UPDATED", timestamp, latencyMs, message: "HVAC relay switched to standby by campus operations", status: "warning" };
      break;
    case "LIGHTS_ON":
      next = { ...next, lightingOn: true };
      audit = { id: eventId, nodeId, source, event: "RELAY_UPDATED", timestamp, latencyMs, message: "Lighting relay switched ON by campus operations", status: "success" };
      break;
    case "LIGHTS_OFF":
      next = { ...next, lightingOn: false };
      audit = { id: eventId, nodeId, source, event: "RELAY_UPDATED", timestamp, latencyMs, message: "Lighting relay switched to standby by campus operations", status: "warning" };
      break;
    case "RESET":
      next = createInitialSnapshot();
      next.nodeId = nodeId;
      next.event = "RESET";
      next.timestamp = timestamp;
      next.eventId = eventId;
      audit = {
        id: eventId, nodeId, source: "SYSTEM", event: "RESET", timestamp, latencyMs: 24,
        message: "Demo telemetry reset to baseline · all services healthy",
        status: "info"
      };
      break;
  }

  const derivedEvents: AuditEvent[] = [audit];
  if (event === "EARLY_EXIT") {
    derivedEvents.push({
      id: `${eventId}-tutor`, nodeId, source: "AI_TUTOR", event: "TUTOR_DISPATCHED",
      timestamp: new Date(Date.now() + 1).toISOString(), latencyMs: 86,
      message: "Adaptive catch-up path generated · minutes 36–90 queued",
      status: "info"
    });
  }
  if (["ROOM_EMPTY", "ROOM_OCCUPIED", "NFC_TAP", "HVAC_ON", "HVAC_OFF", "LIGHTS_ON", "LIGHTS_OFF"].includes(event)) {
    derivedEvents.push({
      id: `${eventId}-relay`, nodeId, source: "ESP32", event: "RELAY_UPDATED",
      timestamp: new Date(Date.now() + 2).toISOString(), latencyMs: 21,
      message: `Relay state synchronized · HVAC ${next.hvacOn ? "ON" : "STANDBY"} · Lighting ${next.lightingOn ? "ON" : "STANDBY"}`,
      status: "success"
    });
  }
  next.events = [...derivedEvents, ...previous.events].slice(0, 40);
  store.snapshot = next;

  return json({ ok: true, snapshot: next, acceptedAt: timestamp }, 202);
}
