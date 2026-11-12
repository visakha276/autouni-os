export type Persona = "student" | "lecturer" | "ops";
export type EdgeEventType = "NFC_TAP" | "EARLY_EXIT" | "ROOM_EMPTY" | "ROOM_OCCUPIED" | "MC_VALID" | "MC_TAMPER" | "QUIZ_COMPLETE" | "RESET" | "HVAC_ON" | "HVAC_OFF" | "LIGHTS_ON" | "LIGHTS_OFF";

export type AuditEvent = {
  id: string;
  nodeId: string;
  source: "ESP32" | "SIMULATOR" | "VISION" | "AI_TUTOR" | "SYSTEM";
  event: EdgeEventType | "BOOT" | "TUTOR_DISPATCHED" | "RELAY_UPDATED" | "STP_APPROVED";
  timestamp: string;
  latencyMs: number;
  message: string;
  status: "success" | "warning" | "danger" | "info";
};

export type EdgeSnapshot = {
  nodeId: string;
  event: EdgeEventType | "BOOT";
  timestamp: string;
  eventId: string;
  occupancy: number;
  hvacOn: boolean;
  lightingOn: boolean;
  energySavedPercent: number;
  lastLatencyMs: number;
  riskScore: number;
  tutorActive: boolean;
  attendanceStatus: "PRESENT" | "AT_RISK" | "EXCUSED";
  earlyExitMinute: number | null;
  events: AuditEvent[];
};
