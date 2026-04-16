# Aetherium Manifest

Aetherium Manifest is a real-time, light-first runtime that maps intent/state signals into readable manifestation output. The homepage is intentionally minimal: a full-screen light field, one composer, and one Settings entry point.

## What is in this repository

- **Clean first-use surface (default):** calm visual field + language-aware response orchestration + luminous text manifestation.
- **FastAPI prototype gateway:** validation/emit endpoints and websocket stream under `api_gateway/`.
- **Contract-first schemas + governance runtime:** deterministic policy and compatibility path.
- **Tooling:** contract checks, fuzzing, benchmark scripts, and parity tests.

## First-use surface contract

The first view intentionally renders only:

- Full-screen manifestation canvas.
- Minimal bottom composer.
- One Settings button.
- Subtle human-readable status + readable text fallback.

Advanced panels and technical controls (telemetry, lineage/replay, scholar/debug/runtime tools, connection settings, language/voice options) are available **inside Settings only**.

See details: [`docs/clean_first_use_surface.md`](docs/clean_first_use_surface.md).

## Run locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## API gateway (prototype)

```bash
cd api_gateway
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Endpoints:

- `POST /api/v1/cognitive/emit`
- `POST /api/v1/cognitive/validate`
- `GET /health`
- `WS /ws/cognitive-stream`

## Core checks

```bash
npm run lint
cd api_gateway && pytest -q
python3 tools/contracts/contract_checker.py
python3 tools/contracts/contract_fuzz.py
python3 tools/benchmarks/runtime_semantic_benchmark.py --input tools/benchmarks/runtime_semantic_samples.sample.json
npx --yes tsx --test test_runtime_governor_psycho_safety.test.ts
```

## Audit backlog policy

Completed recommendations must be removed from backlog documents to avoid mixing done work with pending work:

- English: [`docs/CODEBASE_AUDIT_TASKS_EN.md`](docs/CODEBASE_AUDIT_TASKS_EN.md)
- Thai: [`docs/CODEBASE_AUDIT_TASKS_TH.md`](docs/CODEBASE_AUDIT_TASKS_TH.md)
