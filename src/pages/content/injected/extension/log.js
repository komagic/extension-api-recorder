export default function colorLog(message, type) {
  let color;

  switch (type) {
    case 'success':
      color = COLORS.FgGreen;
      break;
    case 'info':
      color = COLORS.FgBlue;
      break;
    case 'error':
      color = COLORS.FgRed;
      break;
    case 'warning':
      color = COLORS.FgYellow;
      break;
    default:
      color = COLORS[type];
      break;
  }

  console.log(color, message);
}

const COLORS = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

const KEY_DEBUG = 'api_recorder_debug';
let is_debug_mode;
try {
  is_debug_mode = localStorage.getItem(KEY_DEBUG);
} catch (error) {
  console.warn('localStorage error');
}

export function logger(...args) {
  if (!is_debug_mode) {
    return;
  }
  if (args.length === 2 && ['success'].includes(args[1])) {
    colorLog(args[1], args[0]);
  }
  console.log(COLORS.FgGreen, ...args);
}
