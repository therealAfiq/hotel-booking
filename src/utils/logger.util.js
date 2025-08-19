function log(level, message, ...args) {
  console.log(`[${level.toUpperCase()}]`, message, ...args);
}

module.exports = {
  info: (msg, ...args) => log('info', msg, ...args),
  warn: (msg, ...args) => log('warn', msg, ...args),
  error: (msg, ...args) => log('error', msg, ...args),
  debug: (msg, ...args) => log('debug', msg, ...args),
};
