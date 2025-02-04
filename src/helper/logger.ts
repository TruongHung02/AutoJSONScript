export const color = {
  reset: '\x1b[0m',

  // Màu chữ (foreground)
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Màu nền (background)
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
}

export const logger = {
  info: (message: string) => {
    console.log(color.cyan + '[INFO] ' + message + color.reset)
  },
  error: (message: string) => {
    console.log(color.bgRed + color.white + '[ERROR] ' + message + color.reset)
  },
  success: (message: string) => {
    console.log(color.green + '[SUCCESS] ' + message + color.reset)
  },
}
