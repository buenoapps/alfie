# Alfie — Learn the Alpha-bee-t

A super-simple alphabet app for kids, fronted by **Alfie** the bumblebee. Tap a letter, hear it, see a friendly example word.

Built with [Expo](https://expo.dev) + Expo Router.

## Run it

```bash
npm install
npx expo start
```

Then press `i` for iOS Simulator, `a` for Android emulator, or `w` for web.

## How it works

- **Home** — Alfie greets you and shows a colorful A–Z grid. Tap any letter to open it.
- **Letter screen** — A giant uppercase + lowercase letter, an example word with an emoji, and Alfie holding the matching block. Tap the speaker (or the letter itself) to hear it again. Use the arrows to step through A→Z.

Audio is spoken via `expo-speech` (system text-to-speech), so it works offline and on every device with a system voice.

## Project layout

```
app/
  _layout.tsx        Stack navigation root
  index.tsx          Home: Alfie greeting + A–Z grid
  letter/[id].tsx    Letter detail screen
components/
  alfie.tsx          The bee mascot (react-native-svg)
  letter-tile.tsx    A tappable A–Z grid tile
  speaker-button.tsx Round speaker control
constants/
  letters.ts         A–Z entries (letter, word, emoji, color)
  theme.ts           Color palette + fonts
```
