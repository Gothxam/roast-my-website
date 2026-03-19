const { join } = require('path');
const os = require('os');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Only use project-local cache on Linux (Render/CI)
  // On Windows (Local Dev), we use the default system cache to avoid errors
  cacheDirectory: os.platform() === 'win32' 
    ? join(os.homedir(), '.cache', 'puppeteer')
    : join(__dirname, '.cache', 'puppeteer'),
};
