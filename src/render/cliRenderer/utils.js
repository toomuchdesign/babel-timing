const readline = require('readline');

function enableKeyPressEvent() {
  // Make `process.stdin` begin emitting "keypress" events
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
}

exports.enableKeyPressEvent = enableKeyPressEvent;
