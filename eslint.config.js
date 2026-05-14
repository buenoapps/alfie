// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      // Reanimated's API is built on mutating `sharedValue.value`, including
      // inside event handlers. The React Compiler immutability rule flags this
      // intended pattern, so it's turned off for this Reanimated-based app.
      'react-hooks/immutability': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
