# Alfie — Learn the Alpha-bee-t

A super-simple learning app for kids, fronted by **Alfie** the bumblebee. Two levels: the alphabet (A–Z + letter quiz) and short, simple words (Mum, Dad, Sun… in EN; Mama, Papa, Kaka, Bus… in DE).

Built with [Expo](https://expo.dev) + Expo Router.

## Run it

```bash
npm install
npx expo start
```

Then press `i` for iOS Simulator, `a` for Android emulator, or `w` for web.

## What's in it

- **Home** — Alfie greets the kid and shows two big level cards: **Letters** and **Words**. The EN / DE pill in the top-right flips every UI string and the spoken audio.
- **Letters level**
  - **`/alphabet`** — colorful A–Z grid. Tap a tile to open the letter; tap **Play letter game** to start the quiz.
  - **Letter detail** — giant upper- and lowercase letter, an example word, an emoji. Tapping the letter, the speaker, or the emoji replays the word + letter. Arrows step through A → Z, swapping content **in place** (no page transition).
  - **Letter quiz** — five randomly-picked emojis, four letter buttons each. Wrong taps shake red and lock; the right one flashes green before the next question.
- **Words level**
  - **`/words`** — 3-column grid of short words (≤ 4 chars), language-aware (`Mum / Dad / Sun…` in EN, `Mama / Papa / Kaka / Bus…` in DE). Tap a tile, or tap **Play word game** for the quiz.
  - **Word detail** — emoji + giant word in a single white card; tapping the card replays the audio. Arrows step through the list in place.
  - **Word quiz** — same shape as the letter quiz, but the four buttons show whole words.
- **Audio mute** — the round speaker between the prev/next arrows on letter and word detail toggles audio app-wide. The icon flips between `speaker.wave.2.fill` and `speaker.slash.fill`. Persisted across launches.
- **Persisted language** — EN / DE choice persists via `AsyncStorage` and is remembered between launches.
- **Dark mode** — auto-follows the OS color scheme. Cards and tile pastels stay bright in either mode for contrast.

Audio uses `expo-speech` — system text-to-speech, no audio assets, no network.

## Scripts

| Script | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` / `android` / `web` | Open directly on a simulator / emulator / web |
| `npm test` | Run the Jest suite (130 tests across 20 suites) |
| `npm run lint` | `expo lint` |

Type-check with `npx tsc --noEmit`. The CI workflow at `.github/workflows/ci.yml` runs lint, type-check, tests, and a web bundle export on every push to `main` and every pull request targeting `main`.

## Project layout

```
app/
  _layout.tsx            Stack root: theme + language + audio providers
  index.tsx              Home: Alfie + EN/DE toggle + level cards
  alphabet.tsx           A–Z grid + Play letter game
  letter/[id].tsx        Letter detail (in-place A→Z stepper)
  quiz.tsx               Letter quiz (emoji → 4 letter buttons)
  words.tsx              Word grid + Play word game
  word/[id].tsx          Word detail (in-place stepper)
  word-quiz.tsx          Word quiz (emoji → 4 word buttons)
components/
  alfie.tsx              Bee mascot (react-native-svg + reanimated)
  level-card.tsx         Big tappable level card on home
  letter-tile.tsx        A–Z grid tile
  word-tile.tsx          Word grid tile (emoji + word)
  speaker-button.tsx     Mute / unmute toggle (with muted state)
  language-toggle.tsx    EN / DE pill
  themed-text.tsx        Theme-aware Text wrapper
  themed-view.tsx        Theme-aware View wrapper
  ui/icon-symbol.{ios,}.tsx   SF Symbols → MaterialIcons fallback
constants/
  letters.ts             A–Z + per-language word/emoji + tile color
  words.ts               Per-language short-word lists (≤ 4 chars)
  strings.ts             EN / DE UI strings + speechLocale()
  theme.ts               Palette, light/dark Colors, useTheme(), tint()
contexts/
  language.tsx           LanguageProvider + useLanguage (persists EN/DE)
  audio.tsx              AudioProvider + useAudio (persists mute state)
hooks/
  use-color-scheme.ts    System color scheme (with web hydration variant)
  use-theme-color.ts     Resolves a single theme color
.github/workflows/ci.yml CI: lint, type-check, tests, build
```

## Tech notes

- Expo SDK 54, React 19.1, React Native 0.81, expo-router 6 (file-based routing, typed routes).
- `react-native-reanimated` drives Alfie's bob/wing flap, the letter and word spring-ins, and the quiz green/red answer effects.
- `react-native-svg` for the mascot.
- `@react-native-async-storage/async-storage` for persisted language and mute state.
- No backend; everything runs on-device.

## App Store metadata

The on-device display name is `expo.name` in `app.json` (currently **Alfie**). The App Store Connect listing — the long-form title shown on the store page — is managed via [EAS Metadata](https://docs.expo.dev/eas/metadata/) using `store.config.json` at the project root.

```bash
npx eas metadata:push       # push store.config.json → App Store Connect
npx eas metadata:pull       # pull current store metadata → store.config.json
```

`store.config.json` currently sets the App Store title to **"Alfie - alphabet learning app"** for `en-US`. To add a German listing, extend `apple.info` with a `de-DE` entry; to set the subtitle / description / keywords, add them under the same locale block (run `eas metadata:lint` to verify).
