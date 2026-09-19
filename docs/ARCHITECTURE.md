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

Dependencies only point inward. Screens do not know which database is in use, and application services depend only on `WorkoutRepository` and `SessionRepository`.

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
        sessions: new SupabaseSessionRepository(client)
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
- `source_template_id` is ready for future copied/remixed workout lineage.
- String IDs make future client-generated records and cloud synchronization straightforward.

The session snapshot protects history when a workout template changes later.

## Timer correctness

The runner stores `intervalEndsAt`, not a counter that decrements once per second. The UI interval only triggers rendering. Remaining time is always calculated from the current clock.

When the app returns from the background, `advanceTimer` walks through every interval that elapsed and lands on the correct round, movement, phase, and remaining time. Pause captures the exact remaining milliseconds; resume creates a new absolute end timestamp.

## V2 path

V1 intentionally omits accounts and social features. The existing model supports later additions without replacing its core:

- Add `owner_user_id` to templates and sessions.
- Sync the same string IDs to Postgres.
- Use `source_template_id` for workout remixes.
- Add publishing and visibility fields to templates.
- Implement Supabase repository adapters and replace the persistence configuration.
