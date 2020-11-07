import readline from 'readline';

export function enableKeyPressEvent(): void {
  // Make `process.stdin` begin emitting "keypress" events
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
}
