# Swing

Swing is a fast, low-friction workout runner for people who want to stop planning and start moving.

## MVP

- No login; data stays on the device.
- Twelve curated workouts in The Vault.
- Custom workout creation with equipment, intensity, rounds, work/rest timing, and movements.
- Saved workouts and reusable workout templates.
- Accurate timestamp-based workout runner with pause, resume, skip, and end.
- Workout completion history.
- A full-length YouTube video catalog with a persistent, non-repeating Workout of the Day.
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

The core test suite compiles separately and validates the timer, service/repository boundaries, saved history, and Workout of the Day rotation.

## Refresh the video catalog

The app ships with a generated catalog containing regular YouTube videos only. Shorts are excluded. To rebuild it from an updated CSV:

```bash
npm run catalog:build -- /absolute/path/to/workout_catalog.csv
```

The importer normalizes equipment and duration values, removes duplicate video IDs, and classifies content. Only IDs in `scripts/approved-video-workout-ids.json` are marked for daily rotation; the importer fails if an approved video disappears or falls outside the 20–35 minute window.

## Change the colors

Six complete color schemes are defined in `src/theme/colors.ts`. Change the final `colors` export to one of `tealOrangeColors`, `orangeRedColors`, `electricLimeColors`, `purpleCoralColors`, `cobaltYellowColors`, or `hotPinkNavyColors`; Expo Fast Refresh will update the running app. `src/theme/palette.json` holds the default teal/orange values used by Expo's native app configuration.

## Persistence

`src/config/appConfig.ts` is the composition root. The UI and application services receive repository interfaces rather than importing SQLite. To move to Supabase, implement the workout, session, video catalog, and daily-assignment repositories, return them from a new `PersistenceConfig`, and replace the configured persistence adapter.

See `docs/ARCHITECTURE.md` for details.
