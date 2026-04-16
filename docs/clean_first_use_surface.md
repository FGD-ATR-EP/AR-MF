# Clean First-Use Surface

This document describes the refactored homepage runtime for Aetherium Manifest.

## First-view contract

The homepage intentionally renders only:

- Full-screen manifestation canvas (light field).
- Minimal bottom composer.
- One Settings button.
- Subtle human-readable status text and a lightweight readable fallback line.

No dashboard, HUD, debug panel, scholar panel, lineage panel, or runtime console is shown on first view.

## Module split

- `clean-first-surface.js`
  - App bootstrap and orchestration.
  - Settings wiring and session-audit export.
  - Voice progressive-enhancement integration from Settings.
- `first_use_surface/light-manifestation.js`
  - Luminous text renderer with glyph-sampling particle halo.
  - Calm ambient particle field.
  - Reduced-motion aware transitions.
- `first_use_surface/language-layer.js`
  - Deterministic language choice with session memory.
  - Browser-locale + character-range baseline detection.
  - Optional local rule-based detector layer.
- `first_use_surface/response-orchestrator.js`
  - Deterministic first-run response rules for greeting, gratitude, question, unknown intent, and language mismatch.

## Language detection strategy

Resolution order:

1. Explicit user preference in Settings.
2. Browser locale (`navigator.languages` / `navigator.language`).
3. Input heuristics (Thai unicode range vs Latin range).
4. Optional local detector rules (pluggable and safe when disabled).
5. Session language memory.

## Settings as single advanced-control surface

All advanced controls are kept inside Settings:

- API/WS base paths.
- Runtime mode and telemetry options.
- Lineage/replay/scholar/governor/developer toggles.
- Reduced-motion and language/voice/local-detector options.
- Optional voice capture trigger and session-audit export.

## Fallback behavior

- If `SpeechRecognition` is unavailable, voice controls stay in Settings and disable gracefully.
- If language confidence is low, the runtime uses deterministic fallback + session memory.
- If motion is reduced, luminous text remains readable without relying on animation.

## Limitations

- The current language detector is heuristic + local-rule based (no heavy ML model).
- Voice input depends on browser `SpeechRecognition` support.
- Session-audit export remains local-download + in-memory trail.
