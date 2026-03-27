const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 6000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: false,
    screenshotsFolder: 'cypress/artifacts/screenshots',
    videosFolder: 'cypress/artifacts/videos',
    numTestsKeptInMemory: 5,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});
