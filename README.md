# Swing

Swing is a fast, low-friction workout runner for people who want to stop planning and start moving.

## MVP

- No login; data stays on the device.
- Twelve curated workouts in The Vault.
- Custom workout creation with equipment, intensity, rounds, work/rest timing, and movements.
- Saved workouts and reusable workout templates.
- Accurate timestamp-based workout runner with pause, resume, skip, and end.
- Workout completion history.
- Expo SQLite persistence behind repository interfaces that can later be implemented with Supabase/Postgres.

## Run locally

Requirements: Node.js 22.13 or newer and the Expo Go app or a compatible simulator.

```bash
npm install
npm start
```

Then scan the QR code with Expo Go or press `i`/`a` for an iOS/Android simulator.

## Verify

```bash
npm run typecheck
npm test
```

The core test suite compiles separately and validates the timer's absolute-timestamp behavior, background catch-up, pause/resume, duration calculation, and service/repository boundaries.

## Change the colors

All app colors are defined in `src/theme/colors.ts`. Change the exported `colors` value there to replace the teal/orange palette across the app and native app configuration.

## Persistence

`src/config/appConfig.ts` is the composition root. The UI and application services receive repository interfaces rather than importing SQLite. To move to Supabase, implement `WorkoutRepository` and `SessionRepository`, return them from a new `PersistenceConfig`, and replace the configured persistence adapter.

See `docs/ARCHITECTURE.md` for details.
