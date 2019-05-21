const readline = require('readline');

function enableKeyPressEvent() {
  // Make `process.stdin` begin emitting "keypress" events
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
}

function wrapUp(string, maxLength) {
  if (string.length <= maxLength) {
    return string;
  }
  const regex = new RegExp(`.{1,${maxLength}}`, 'g');
  return string.match(regex).join('\n');
}

exports.enableKeyPressEvent = enableKeyPressEvent;
exports.wrapUp = wrapUp;
