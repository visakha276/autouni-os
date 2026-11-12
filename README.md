# AutoUni OS — The Cloud Engineers

A Next.js 16 App Router demo application for the APU SDC Hackathon, built with TypeScript, Tailwind CSS and Lucide React.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this folder to a Git repository and import it into Vercel.
2. Keep the default Next.js build settings (`npm run build`).
3. Add `EDGE_EVENT_SECRET` as a Vercel environment variable. Use a long random value and configure the same value in the ESP32 firmware.
4. Keep `ALLOW_DEMO_SIMULATOR=true` for the public judge controls, or set it to `false` to disable unauthenticated simulator API events.
5. Deploy.

No external database is required for this demonstration.

## ESP32-S3 REST API

The endpoint is `/api/edge-event`.

### GET current edge state

```bash
curl https://YOUR-DEPLOYMENT.vercel.app/api/edge-event
```

### POST a physical node event

```bash
curl -X POST https://YOUR-DEPLOYMENT.vercel.app/api/edge-event \
  -H 'Content-Type: application/json' \
  -d '{"nodeId":"4B","event":"EARLY_EXIT","secret":"YOUR_EDGE_EVENT_SECRET"}'
```

Supported event values:

- `NFC_TAP`
- `EARLY_EXIT`
- `ROOM_EMPTY`
- `ROOM_OCCUPIED`
- `MC_VALID`
- `MC_TAMPER`
- `QUIZ_COMPLETE`
- `HVAC_ON`, `HVAC_OFF`
- `LIGHTS_ON`, `LIGHTS_OFF`
- `RESET`

The frontend polls the endpoint every two seconds. Simulator actions are posted with the `X-AutoUni-Simulator: true` header and are accepted while `ALLOW_DEMO_SIMULATOR` is not `false`.

## Important deployment note: in-memory state

This project intentionally uses a process-level in-memory store (`globalThis`) to satisfy the no-database demo requirement. It works well in a single local Next.js process and in a warm Vercel function instance. **Vercel serverless functions can scale to multiple instances, restart, and handle separate requests in different instances.** Consequently, in-memory state is not a durable or globally shared event bus: a POST and the next GET are not guaranteed to hit the same instance, and state can reset after a cold start. The UI includes a local simulator fallback, but reliable multi-instance physical-hardware synchronization requires a shared service such as Vercel KV/Redis, Postgres, or a dedicated MQTT/event gateway. Do not present the in-memory implementation as durable or globally consistent storage.

## Security notes

- Change the demo shared secret before deployment.
- Do not use the default `autouni2026` value in a public deployment.
- The public simulator control is intentionally enabled for hackathon judging by default. Set `ALLOW_DEMO_SIMULATOR=false` for deployments where anonymous event injection is not acceptable.
- The SHA-256 display hashes a fresh random seed in the browser; the ZK-SNARK proof, TOTP identity verification, SHAP model, Kafka throughput, AI tutor content and MC forensic classification are demonstrator simulations, not connected cryptographic, model-serving, Kafka or clinical verification infrastructure.
- For a production hardware integration, use TLS, a per-device credential, request signing or rotating tokens, replay protection, and rate limiting.
- All student names, IDs, timestamps, credentials, medical certificates and forensic findings in the UI are synthetic demonstration data. The MC scanner is a visual simulation, not a medical-document verification service.

## Demo walkthrough

1. Open **Student Portal** and tap the classroom NFC pass.
2. Trigger **Early Exit → AI Tutor** in Judge Mode to show the early-exit remediation state. The lecturer radar reflects the occupancy and risk change.
3. Complete the two-question quiz to restore the demo attendance status.
4. Use either medical certificate preset to show automatic STP approval or forensic escalation.
5. Open **Campus Ops** to switch HVAC and lighting relays and inspect the event and audit streams.
6. Use **Auto-Play Full Story** for the guided sequence.
