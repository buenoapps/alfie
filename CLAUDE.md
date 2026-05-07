# CLAUDE.md

Notes for future agents working in this repo. Read README.md for the user-facing overview; this file focuses on conventions and gotchas.

## Project

Expo SDK 54 / React 19 / React Native 0.81 / expo-router 6. A single-purpose alphabet learning app for kids.

Three screens, all under `app/`:

- `app/index.tsx` — home (Alfie + A–Z grid + Play button + EN/DE toggle).
- `app/letter/[id].tsx` — letter detail. **Prev/next swap content in place via local state**; the URL stays at the initial letter. Don't reintroduce `router.replace` for stepping.
- `app/quiz.tsx` — 5-question emoji → 4-letter-button quiz.

## Commands

```bash
npm start                    # Expo dev server
npm test                     # Jest (76 tests / 14 suites)
npm run lint                 # expo lint
npx tsc --noEmit             # type-check
npx expo export --platform web --output-dir dist   # build sanity check
```

CI mirrors these in `.github/workflows/ci.yml` (Node 20, runs on push to `main` and PRs targeting `main`). If you change one of these commands, update both `package.json` scripts and the workflow.

## Workflow

The repo owner has been explicit:

> Always rebase changes on main branch and create a new PR against main.

Practical playbook for each round of changes:

1. `git fetch origin main && git rebase origin/main` on `claude/alphabet-learning-app-asAU6` (the only branch we push to).
2. Implement.
3. `npm run lint && npx tsc --noEmit && npm test && npx expo export --platform web` locally before push.
4. `git push -u origin claude/alphabet-learning-app-asAU6` (use `--force-with-lease` if rebase rewrote history). After a PR merges the remote branch is usually deleted, so the next push is a fresh ref.
5. Open a new PR against `main` via the GitHub MCP tool. Don't reuse a stale PR.

## Conventions

- **Styling**: theme colors come from `constants/theme.ts`. Read screen / text / textSoft via `useTheme()` and pass them inline (`style={[styles.x, { backgroundColor: theme.screen }]}`) rather than baking them into `StyleSheet.create`. Brand colors (honey / blossom / sky) live on `Palette` and are theme-agnostic.
- **Cards stay white in both light and dark mode** — that's the visual identity. Only screen backgrounds and outer body text flip.
- **Tile pastels (`TileColors`) are the same in both modes**; the dark text on them works on either.
- **Letter content** (per-language word + emoji + color) is in `constants/letters.ts`. Add new languages by extending the `Language` union and the `EN`/`DE`-style maps; UI strings live in `constants/strings.ts`.
- **Speech**: always pass `language: speechLocale(lang)`. Word first, letter second on the detail screen (chained via `onDone`). On the quiz, `speakWord` runs on each new question + on emoji tap; `speakLetter` runs on every option tap.
- **Haptics** are gated on `process.env.EXPO_OS === 'ios'`; preserve this guard.
- **Animations**: react-native-reanimated only. Patterns to copy: `withSequence(...)` for shake / pulse, `useSharedValue` + `useAnimatedStyle` on a wrapping `Animated.View`. Reanimated is mocked in tests so animations don't actually run.
- **Comments**: don't add narrative comments; the code is small. Only comment when the *why* isn't obvious.

## Tests

Jest + jest-expo + `@testing-library/react-native`. Setup file is `jest.setup.js`. It mocks:

- `expo-router` (`useRouter`, `useLocalSearchParams`, `Stack`, `Link`)
- `expo-speech`, `expo-haptics`, `expo-symbols`
- `@react-native-async-storage/async-storage` (in-memory)
- Reanimated (via the package's built-in `mock`)

Gotchas:

- `react-native-svg` text content (e.g. the letter on Alfie's block) is **not** reachable via `getByText` — assert against the JSON dump (`JSON.stringify(tree.toJSON())`) instead.
- The quiz uses `shuffle()` (Fisher-Yates). Tests stub `Math.random` to `0.9999` so the shuffle becomes a no-op — that puts the answer at index 0 of `options` and lets `[A,B,C,D,E]` be the question order. If you change the shuffle, fix this.
- Some tests intentionally don't `await` the AsyncStorage hydration in `LanguageProvider`; React 19 prints an `act()` warning. It's benign — don't refactor every test to silence it.

## Things to avoid

- **Don't add a tabs layout back.** The app is intentionally a single Stack with no tab bar.
- **Don't introduce `react-navigation/bottom-tabs` or modal presentations** for new screens unless asked.
- **Don't use `expo install` from inside this sandbox** — the network sometimes blocks Expo's compatibility API. Use plain `npm install <pkg>@<version>` and look the right version up in `node_modules/expo/bundledNativeModules.json`.
- **Don't push directly to `main`** or to a branch other than `claude/alphabet-learning-app-asAU6`.
- **Don't bypass commit hooks** (`--no-verify`) or skip CI.
- **Don't add narrative comments** ("// added for X feature", "// used by Y").

## Files I reach for first

| Thing | File |
| --- | --- |
| Add a screen | `app/<name>.tsx` + a `<Stack.Screen>` in `app/_layout.tsx` |
| Add or tweak letter data | `constants/letters.ts` |
| Add or tweak UI strings | `constants/strings.ts` |
| Add a theme color | `constants/theme.ts` (extend both `Colors.light` and `Colors.dark`) |
| New animation | Copy the shake/pulse pattern in `app/quiz.tsx` |
| Persist new state | `AsyncStorage` via the `language.tsx` pattern (load on mount, write on change) |
