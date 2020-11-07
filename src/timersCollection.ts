import Timer from './Timer';

let timers = new Map<string, Timer>();

export function getAll() {
  return [...timers.entries()].map((entry) => entry[1]);
}

export function clear() {
  timers = new Map();
}

export function getTimer(file: string): Timer {
  const timer = timers.get(file);
  if (timer) {
    return timer;
  } else {
    const newTimer = new Timer(file);
    timers.set(file, newTimer);
    return newTimer;
  }
}
