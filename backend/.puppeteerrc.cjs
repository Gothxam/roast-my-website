const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to be within the project.
  // This ensures Render persists the downloaded Chrome binary.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
