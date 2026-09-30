# Swing V1 architecture

## Dependency direction

```text
React Native screens
        ↓
Application services
        ↓
Repository interfaces
        ↓
SQLite repositories → generic database client → Expo SQLite
```

Dependencies only point inward. Screens do not know which database is in use, and application services depend only on repository interfaces.

## Composition root

`src/config/appConfig.ts` chooses the persistence implementation. V1 passes `sqlitePersistence('swing.db')`. The adapter opens the database, runs migrations, constructs repositories, and seeds The Vault.

For Supabase, create a second persistence adapter:

```ts
export function supabasePersistence(config: SupabaseConfig): PersistenceConfig {
  return {
    async createRepositories() {
      const client = createClient(config.url, config.anonKey);
      return {
        workouts: new SupabaseWorkoutRepository(client),
        sessions: new SupabaseSessionRepository(client),
        videoWorkouts: new SupabaseVideoWorkoutRepository(client),
        dailyVideoWorkouts: new SupabaseDailyVideoWorkoutRepository(client)
      };
    }
  };
}
```

Only the configured adapter changes. Screens, services, and domain timer logic remain unchanged.

## Data model

- `workout_templates` stores the reusable workout definition.
- `workout_exercises` stores ordered movements belonging to a template.
- `workout_sessions` stores each workout attempt, including an immutable workout snapshot and recoverable timer state.
- `workout_videos` stores normalized full-length YouTube catalog entries and their daily-rotation eligibility.
- `daily_workout_assignments` stores one selected video per local calendar day.
- `source_template_id` is ready for future copied/remixed workout lineage.
- String IDs make future client-generated records and cloud synchronization straightforward.

The session snapshot protects history when a workout template changes later.

## Workout of the Day

`VideoWorkoutOfDayService` first returns an existing assignment for the local date. For a new day it selects from active, eligible videos by lowest display count and then oldest display date. As a result, every eligible video is shown before one repeats. A date-based hash provides a stable tie-break without coupling the service to SQLite.

The checked-in catalog is generated from the source CSV. Regular videos are retained, Shorts are excluded, equipment and durations are normalized, and only likely follow-along or mobility sessions longer than nine minutes are marked eligible. Catalog seeding is versioned in `app_metadata`, so the full import only runs when the bundled catalog changes.

## Timer correctness

The runner stores `intervalEndsAt`, not a counter that decrements once per second. The UI interval only triggers rendering. Remaining time is always calculated from the current clock.

When the app returns from the background, `advanceTimer` walks through every interval that elapsed and lands on the correct round, movement, phase, and remaining time. Pause captures the exact remaining milliseconds; resume creates a new absolute end timestamp.

## V2 path

V1 intentionally omits accounts and social features. The existing model supports later additions without replacing its core:

- Add `owner_user_id` to templates and sessions.
- Add `owner_user_id` to daily assignments and make `(owner_user_id, local_date)` unique.
- Sync the same string IDs to Postgres.
- Use `source_template_id` for workout remixes.
- Add publishing and visibility fields to templates.
- Implement Supabase repository adapters and replace the persistence configuration.
