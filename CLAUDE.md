# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npx expo start       # Start dev server (Expo Go / web)
expo run:android     # Build and run on Android
npm run web          # Start web version
npm test             # Run Jest tests (watch mode)
npm run lint         # Run Expo linter
npm run predeploy    # Export for web (expo export -p web)
npm run deploy       # Deploy to GitHub Pages
```

To run a single test file:
```bash
npx jest path/to/test.ts
```

## Architecture

This is an **Expo / React Native** app (using Expo Router for file-based routing) that renders local JSON quiz content with spaced-repetition tracking.

### Routing (`app/`)

File-based routing via Expo Router:
- `(tabs)/index` — Home: topic grid + global "Start" button
- `(tabs)/stats` — Global stats screen
- `(tabs)/[topic_slug]/index` — Topic page with its quizzes
- `(tabs)/[topic_slug]/[quiz_slug]/index` — Quiz detail page
- `(tabs)/session/[index]` — Active question screen (navigates `session/0`, `session/1`, …)
- `(tabs)/session/end` — End-of-session summary screen

The root `_layout.tsx` wraps everything in `ThemeProvider` then `SessionProvider`.

### Content (`assets/content/`)

All quiz content is static JSON files organized by topic slug:
```
assets/content/<topic_slug>/index.json   ← Topic metadata (name, slug, description, image, quiz list)
assets/content/<topic_slug>/<quiz>.json  ← Quiz with questions, glossary, infoTable
```

`types/Data.tsx` is the central registry — it `require()`s all JSON files and exposes helpers (`getTopics`, `getQuiz`, `getAllFlatQuestions`, etc.). **When adding a new topic or quiz, update `types/Data.tsx` manually** (or re-run `node dev/auto_assets.js` which regenerates the registry from the filesystem).

### Quiz JSON schema

```json
{
  "name": "...", "slug": "...", "description": "...", "image": "...",
  "infoTable": [{ "key": "...", "value": "..." }],
  "glossary": [{ "term": "...", "definition": "..." }],
  "questions": [{ "type": "mcq|tf|text", "title": "...", "description": "...", "choices": [], "answers": [], "id": "..." }]
}
```

Question types: `mcq` (single/multi choice), `tf` / `truefalse` (true/false), `text` (cas clinique — free-text shown for user self-assessment).

### State management

Two React Contexts defined in `types/` (unusual location — they are not pure type files):

- **`ThemeContext`** (`types/ThemeContext.tsx`) — dark/light theme, persisted to AsyncStorage. Exposes `useTheme()`, `useThemeColors()`, `useThemedStyles(factory)`.
- **`SessionContext`** (`types/SessionContext.tsx`) — active quiz session + all per-question stats. Spaced-repetition ordering: unseen questions first, then prioritized by `hoursSince × (1 - correctRatio × 0.5)`. Stats persisted per quiz to AsyncStorage under key `quiz_stats__<topicSlug>__<quizSlug>`.

### Theming

All colors come from `constants/Color.tsx` (`darkColors` / `lightColors`). Never hard-code colors — use `useThemeColors()` for direct access or `useThemedStyles(factory)` to memoize a `StyleSheet` per theme. Global shared styles (`.card`, `.container`, `.text`) live in `constants/GlobalStyle.tsx` via `useGlobalStyles()`.

### Question components

`components/questions/` contains one component per question type (`RadioQuestion`, `TrueFalseQuestion`, `TextQuestion`). Each receives `{ question, verify, setValid }` — `setValid(index, bool)` reports per-choice correctness back up to the session screen. `BaseQuestion.ts` has the shared correctness-checking logic (`updateSingleSelectionValidity`, `updateMultiSelectionValidity`).

### Sounds

`utils/sounds.ts` exposes `playCorrect()`, `playWrong()`, `playNext()` using `expo-av`. Audio files are in `assets/sounds/`.


## Operational guidelines

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
