const Timer = require('./Timer.ts').default;

let timers = new Map();

function getAll() {
  return [...timers.entries()].map(entry => entry[1]);
}

function clear() {
  timers = new Map();
}

function getTimer(file) {
  if (!timers.has(file)) {
    timers.set(file, new Timer(file));
  }
  return timers.get(file);
}

module.exports = {
  getAll: getAll,
  clear: clear,
  getTimer: getTimer,
};
