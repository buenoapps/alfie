# Alfie — Learn the Alpha-bee-t

A super-simple alphabet app for kids, fronted by **Alfie** the bumblebee. Tap a letter, hear it, see a friendly example word — or play a quick quiz to practice.

Built with [Expo](https://expo.dev) + Expo Router.

## Run it

```bash
npm install
npx expo start
```

Then press `i` for iOS Simulator, `a` for Android emulator, or `w` for web.

## What's in it

- **Home** — Alfie greets you above a colorful A–Z grid. Tap any tile to open the letter, or tap **Play a game** for the quiz.
- **Letter detail** — A giant upper- and lowercase letter, an example word, and an emoji. Tapping the letter, the speaker, or the emoji replays the word + letter. The arrows step through A → Z, swapping the content **in place** with no page transition.
- **Quiz** — Five randomly-picked emojis. For each, four letter buttons (one correct + three random distractors). Wrong taps shake red and lock; the right one flashes green and pulses before the next question. Score (first-try corrects) shows at the end.
- **Two languages, EN / DE** — A pill in the home top-right switches every UI string and the spoken audio (`en-US` ↔ `de-DE`). The choice is persisted via `AsyncStorage`, so the app remembers it between launches. All 26 letters have a German example word and emoji.
- **Dark mode** — The app auto-follows the OS color scheme. Cards and tile pastels stay bright in either mode for contrast.

Audio uses `expo-speech` — system text-to-speech, no audio assets, no network.

## Scripts

| Script | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` / `android` / `web` | Open directly on a simulator / emulator / web |
| `npm test` | Run the Jest suite (76 tests across 14 suites) |
| `npm run lint` | `expo lint` |

Type-check with `npx tsc --noEmit`. The CI workflow at `.github/workflows/ci.yml` runs lint, type-check, tests, and a web bundle export on every push to `main` and every pull request targeting `main`.

## Project layout

```
app/
  _layout.tsx            Stack root: theme + language providers, status bar
  index.tsx              Home: Alfie + A–Z grid + Play button
  letter/[id].tsx        Letter detail (in-place A→Z stepper)
  quiz.tsx               Emoji → 4-letter quiz screen
components/
  alfie.tsx              Bee mascot (react-native-svg + reanimated)
  letter-tile.tsx        A–Z grid tile
  speaker-button.tsx     Round speaker control
  language-toggle.tsx    EN / DE pill
  themed-text.tsx        Theme-aware Text wrapper
  themed-view.tsx        Theme-aware View wrapper
  ui/icon-symbol.{ios,}.tsx   SF Symbols → MaterialIcons fallback
constants/
  letters.ts             A–Z + per-language word/emoji + tile color
  strings.ts             EN / DE UI strings + speechLocale()
  theme.ts               Palette, light/dark Colors, useTheme(), tint()
contexts/
  language.tsx           LanguageProvider + useLanguage hook (persists EN/DE)
hooks/
  use-color-scheme.ts    System color scheme (with web hydration variant)
  use-theme-color.ts     Resolves a single theme color
.github/workflows/ci.yml CI: lint, type-check, tests, build
```

## Tech notes

- Expo SDK 54, React 19.1, React Native 0.81, expo-router 6 (file-based routing, typed routes).
- `react-native-reanimated` drives Alfie's bob/wing flap, the letter spring-in, and the quiz green/red answer effects.
- `react-native-svg` for the mascot.
- `@react-native-async-storage/async-storage` for the persisted language.
- No backend; everything runs on-device.
