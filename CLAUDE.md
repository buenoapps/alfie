# CLAUDE.md

Notes for future agents working in this repo. Read README.md for the user-facing overview; this file focuses on conventions and gotchas.

## Project

Expo SDK 56 (preview) / React 19.2 / React Native 0.85 / expo-router 6. A two-level learning app for kids: alphabet (A–Z) and short words.

Screens, all under `app/`:

- `app/index.tsx` — home: Alfie + EN/DE toggle + 2 `LevelCard`s (Letters, Words). No grid here anymore.
- `app/alphabet.tsx` — A–Z tile grid + Play letter game.
- `app/letter/[id].tsx` — letter detail. **Prev/next swap content in place via local state**; the URL stays at the initial letter. Don't reintroduce `router.replace` for stepping.
- `app/quiz.tsx` — letter quiz (5 questions, 4 letter buttons each).
- `app/words.tsx` — language-aware short-word grid (3 cols, ≤ 4-char words) + Play word game.
- `app/word/[id].tsx` — word detail. Same in-place stepping pattern as letter detail.
- `app/word-quiz.tsx` — word quiz (5 questions, 4 word buttons each). Structurally a duplicate of `quiz.tsx` for letters — keep them separate, do not abstract into one generic quiz.

## Commands

```bash
npm start                    # Expo dev server
npm test                     # Jest (130 tests / 20 suites)
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
- **Letter content** (per-language word + emoji + color) is in `constants/letters.ts`. **Word content** is in `constants/words.ts` — lists are independent per language (not translations of each other) and every word is ≤ 4 characters. UI strings live in `constants/strings.ts`. Add new languages by extending the `Language` union and adding parallel maps in all three.
- **Speech**: always pass `language: speechLocale(lang)`. On letter detail, word first, letter second (chained via `onDone`). On the letter quiz: `speakWord` per new question + on emoji tap; `speakLetter` on every option tap. On the word quiz: `speakWord(answer)` per new question; `speakChoice(word)` on every option tap. All call sites must check `useAudio().enabled` (or guard inside the speak callbacks) so the global mute respects every path.
- **Haptics** are gated on `process.env.EXPO_OS === 'ios'`; preserve this guard.
- **Animations**: react-native-reanimated only. Patterns to copy: `withSequence(...)` for shake / pulse, `useSharedValue` + `useAnimatedStyle` on a wrapping `Animated.View`. Reanimated is mocked in tests so animations don't actually run.
- **Comments**: don't add narrative comments; the code is small. Only comment when the *why* isn't obvious.

## Tests

Jest + jest-expo + `@testing-library/react-native`. Setup file is `jest.setup.js`. It mocks:

- `expo-router` (`useRouter`, `useLocalSearchParams`, `Stack`, `Link`)
- `expo-speech`, `expo-haptics`, `expo-symbols`
- `@react-native-async-storage/async-storage` (in-memory)
- Reanimated (via the package's built-in `mock`)

The jest config in `package.json` sets `"resolver": "react-native-worklets/jest/resolver.js"` — Reanimated 4 depends on `react-native-worklets`, and that resolver strips `.native` extensions so the worklets module doesn't try to initialize its native part under jest. Don't remove it.

Gotchas:

- `react-native-svg` text content (e.g. the letter on Alfie's block) is **not** reachable via `getByText` — assert against the JSON dump (`JSON.stringify(tree.toJSON())`) instead.
- The quiz uses `shuffle()` (Fisher-Yates). Tests stub `Math.random` to `0.9999` so the shuffle becomes a no-op — that puts the answer at index 0 of `options` and lets the first N items of the source list be the question order. Both `quiz.tsx` and `word-quiz.tsx` rely on this; if you change the shuffle, fix both.
- Some tests intentionally don't `await` the AsyncStorage hydration in `LanguageProvider` / `AudioProvider`; React 19 prints an `act()` warning. It's benign — don't refactor every test to silence it.
- Async hydration of `AudioProvider` is **after** the screen's mount-speak effect. To assert mute behavior in tests, write the storage value first, render, then `await waitFor(() => getByLabelText('Unmute audio'))` before `mockClear()`-ing `Speech.speak` and triggering the action you actually want to verify (see `app/__tests__/word.test.tsx`).

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
| Add or tweak word data | `constants/words.ts` (per-language, ≤ 4 chars, lowercase id) |
| Add or tweak UI strings | `constants/strings.ts` |
| Add a theme color | `constants/theme.ts` (extend both `Colors.light` and `Colors.dark`) |
| New animation | Copy the shake/pulse pattern in `app/quiz.tsx` |
| Persist new state | `AsyncStorage` via the `language.tsx` / `audio.tsx` pattern (load on mount, write on change) |
| Add a learning level | New `app/<level>.tsx` (grid + Play CTA) + `app/<level>-quiz.tsx` + a third `LevelCard` on home; mirror the alphabet/words structure |
