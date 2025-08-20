// src/utils/logger.util.js
function log(level, message, ...args) {
  // keep simple; you can swap for pino/winston later
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}]`, message, ...args);
}
module.exports = {
  info: (msg, ...args) => log('info', msg, ...args),
  warn: (msg, ...args) => log('warn', msg, ...args),
  error: (msg, ...args) => log('error', msg, ...args),
  debug: (msg, ...args) => log('debug', msg, ...args),
};
