// Layered on top of app.json. Without EXPO_BASE_URL set, this is a no-op
// passthrough — local dev and EAS builds behave exactly like before. The
// GitHub Pages workflow sets EXPO_BASE_URL=/<repo> so the web export's
// asset URLs and routes are prefixed correctly for the project page URL
// `<owner>.github.io/<repo>/`.
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;
  if (!baseUrl) return config;
  return {
    ...config,
    experiments: {
      ...(config.experiments ?? {}),
      baseUrl,
    },
  };
};
