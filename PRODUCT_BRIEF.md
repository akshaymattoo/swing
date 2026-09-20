# Swing — Product Brief

## Product idea

**Swing** is a fast, low-friction workout app for busy people who are already committed to working out but do not want to spend their limited workout time planning what to do.

The core behavior is simple:

> Open Swing → create or find a workout → fire up the rounds → get it done.

Music complements the workout rather than defining the product.

**Working brand line:** **Give it a swing.**

The brand should feel modern, energetic, confident, playful, and slightly irreverent — not like a traditional gym tracker.

---

## Target user

Busy people who want to consistently fit effective workouts into real life.

They may only have 10–30 minutes available. They already want to exercise; their problem is friction: deciding what to do, configuring a timer, remembering the sequence, and finding music.

Swing should make starting almost instantaneous.

---

# V1 — Personal Workout Runner

V1 should be intentionally focused. It is primarily a personal workout creation and execution tool.

## Core equipment categories

Start with four at-home categories only:

- Bodyweight
- Kettlebell
- Dumbbells
- Bands

Do not expand the equipment taxonomy in V1 unless there is a clear product need.

## Workout creation

A user can create and save a workout with:

- A memorable workout name and optional emoji
- Equipment category
- Number of rounds
- Work duration per interval
- Rest/gap duration between intervals or rounds
- Exercises/movements
- Intensity

The app calculates the total expected workout duration from the workout structure.

The creation experience should be extremely low-friction and usable one-handed on a phone.

## Intensity language

Avoid traditional Beginner / Intermediate / Advanced labels in the primary UI.

Use:

- 🌶️ **Mild** — approachable / beginner
- 🌶️🌶️ **Spicy** — intermediate
- 🌶️🌶️🌶️ **Hot** — advanced / high intensity

These labels are part of Swing's personality and should appear prominently on workout cards.

## Workout names

Workout names should have personality rather than being purely descriptive.

Examples of the tone:

- 🕷️ Spidey Bite 20
- 😈 Mogambo Muscle Torture
- ⚔️ Baahubali Bell Brawl
- 🤠 Gabbar's Swing Tax
- 🏍️ Dhoom Dumbbell Dhamaka
- 💚 Hulk Smash & Dash
- 👽 Jadoo's Band Baaja

The useful metadata — equipment, duration, intensity, rounds — should explain the workout underneath the name.

The current creative direction uses playful, pop-culture-inspired names. They should feel like affectionate workout nicknames and must not imply official celebrity, studio, or character endorsement.

## Workout library / discovery seed

A first-time user should not land on an empty product.

Seed Swing with a small, curated collection of high-quality workouts across all four equipment categories. Approximately 3 workouts per category is enough initially.

Working concept for this collection: **The Vault**.

A user should be able to:

- Create their own workout
- Open The Vault
- Select a premade workout
- Save/copy it
- Start it immediately

The V1 Vault should be designed so it can naturally evolve into community discovery in V2.

## Workout runner / timer

The workout runner is the core V1 experience.

It should provide:

- Large, glanceable countdown timer
- Current round / total rounds
- Current exercise
- Next exercise
- Work/rest state
- Pause
- Resume
- Skip
- End workout
- Clear transitions between work and rest
- Completion state

Timer correctness is more important than visual complexity.

### Timer implementation requirement

Do not implement the timer by simply decrementing a counter every second.

Timer state should be based on absolute timestamps so the workout remains accurate when the app is backgrounded, briefly suspended, or reopened.

Conceptually:

```ts
intervalEndsAt = Date.now() + duration;
remaining = Math.max(0, intervalEndsAt - Date.now());
```

Test app backgrounding, screen lock, interruptions, Bluetooth audio, pause/resume and returning to the app.

## Saved workouts and sessions

The data model must distinguish between:

### Workout Template

The reusable definition of a workout: name, exercises, rounds, timings, equipment and intensity.

### Workout Session

A specific instance of someone performing a Workout Template, including start/end/completion information.

This distinction is required in V1 even though the social features are not being built yet. It is foundational for V2.

Users should be able to:

- See saved workouts
- Repeat a saved workout
- See basic workout history

Do not build sophisticated analytics in V1.

---

# Music

Music is complementary to the workout experience.

The ideal experience is that a user can connect Spotify and Swing can help start appropriate workout music without requiring the user to spend time choosing it.

Longer term, the workout duration could influence the playlist recommendation.

Example:

> 18-minute workout → suggest/start an energetic playlist appropriate for roughly that workout window.

However, Spotify integration must be treated as an external provider boundary rather than a core architectural dependency. Spotify API, playback, Premium-account and commercial-use restrictions should be validated before relying on embedded playback as a core product promise.

The product should still work perfectly with no music provider connected.

Potential future providers include Spotify and Apple Music.

---

# V1 UX principles

Swing should feel dramatically faster than a traditional workout tracker.

Priorities:

1. Low cognitive load
2. Fast start
3. Large, glanceable workout controls
4. Modern mobile-first visual design
5. Personality without sacrificing usability
6. Minimal logging during a workout

Avoid turning Swing into a spreadsheet for sets, reps, calories and performance metrics.

The core mental model is:

> **Time available → equipment → workout → GO**

not:

> Exercise → sets → reps → weight → detailed logging.

---

# V1 technical direction

Preferred starting stack:

- React Native
- Expo
- TypeScript

Use Expo for rapid local development and real-device testing. Expo Go may be useful during early UI development, but the project should expect to use an Expo Development Build as soon as native integrations require it.

The architecture should remain simple for V1 but should not make V2 social features difficult to add.

Do not build V2 features prematurely.

---

# V2 — Social Workout Network (NOT V1 SCOPE)

V2 evolves Swing from a personal workout runner into a network for discovering and sharing workouts.

The key social object is the **Workout**, not a generic text post.

A user should eventually be able to:

- Create a profile
- Publish a workout
- Follow people
- View a feed of workouts from people they follow
- Like workouts
- Comment
- Save workouts
- Perform someone else's workout
- See trending workouts
- Discover workouts by equipment, duration and intensity

The primary social loop should be:

> **Discover → Save/Copy → Do**

rather than simply:

> Read → Like → Scroll.

A workout card could eventually show:

- Workout name
- Creator
- Equipment
- Duration
- Intensity
- Rounds
- Exercises
- Likes/comments
- Number of people who completed it
- A prominent **Do Workout** action

## Workout remix / fork model

A particularly important future concept is the ability to copy and modify another person's workout.

Example:

A user finds **Gabbar Grind**, copies it, changes 5 rounds to 4 and replaces one movement, then saves their own version.

The system should retain lineage back to the source workout.

Conceptually:

> Original Workout → Copied Workout → Modified Workout → Further Copies

This is similar to a lightweight GitHub fork model for workouts.

The V1 data model should make adding this relationship straightforward later.

## Future Vault evolution

V1:

> The Vault = curated Swing workouts

V2:

> The Vault / Discover = curated + community workouts

Possible future discovery tabs:

- For You
- Trending 🔥
- Bodyweight
- Kettlebell
- Dumbbells
- Bands

Later possibilities include challenges, collections, creator reputation, recommendations and trending workout variants. These are explicitly outside V1.

---

# What V1 is NOT

Do not build these unless the product brief is explicitly updated:

- Social feed
- Followers
- Likes/comments
- Creator profiles
- Leaderboards
- Challenges
- AI workout generation
- Nutrition tracking
- Calorie tracking
- Detailed strength/progressive-overload logging
- Wearable integrations
- Complex analytics dashboards
- Video hosting
- Marketplace/trainer functionality

V1 succeeds if creating, finding and completing a workout feels excellent.

---

# Initial success criteria

Before worrying about growth, validate whether Swing becomes genuinely useful in repeated personal use.

Useful behavioral signals include:

- Workouts created
- Workouts started
- Workouts completed
- Saved workouts repeated
- Premade Vault workouts used
- Typical workout duration
- Exercise substitutions
- Time from app open → workout start

The strongest early signal is repeated use: **does someone come back because Swing makes it easier to get their workout in?**

---

# Guidance for Codex

When using this brief to plan implementation:

1. Treat **V1** as the implementation scope.
2. Treat **V2** only as architectural context.
3. Do not implement social features yet.
4. Keep Workout Template and Workout Session separate from the beginning.
5. Design the V1 data model so authorship, publishing, copying/forking and social relationships can be added later without replacing the core workout model.
6. Prefer simple, maintainable architecture over premature scaling.
7. Prioritize timer correctness and real-device behavior.
8. Before implementation, produce an architecture proposal and phased implementation plan for review.

Suggested first Codex task:

> Read `PRODUCT_BRIEF.md` in full. Do not implement anything yet. Propose the V1 technical architecture, data model, navigation structure, state-management approach, persistence strategy, timer architecture, testing strategy, and phased implementation plan. Explicitly explain which V1 decisions preserve a clean path to the V2 social features without prematurely building them.
