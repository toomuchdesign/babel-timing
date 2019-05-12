const PluginsTimer = require('../src/PluginsTimer');

let timers = new Map();

function getAllTimers() {
  return [...timers.entries()];
}

function clearAllTimers() {
  timers = new Map();
}

function getFileTimer(file) {
  if (!timers.has(file)) {
    timers.set(file, new PluginsTimer(file));
  }
  return timers.get(file);
}

module.exports = {
  getAllTimers: getAllTimers,
  clearAllTimers: clearAllTimers,
  getFileTimer: getFileTimer,
};
