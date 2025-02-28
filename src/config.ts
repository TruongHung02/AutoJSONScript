export const config = {
  //profile config
  USER_AGENT:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',

  // script file name
  script: 'auto.genlogin.json',

  //ubuntu chromnium path
  EXECUTABLE_PATH: '/snap/bin/chromium',

  //browser config
  headless: false, // true / false
  screen_resolution: '1920,1080',
  window_size: '1280,780',
  //screen shot after each node
  screenshot: false, // true / false

  //proxy config
  useProxy: true, // true / false

  //extensions list
  extensions: ['Gradient1.0.22_0'],

  baseURL: 'https://report.nodeverse.ai/api/docs',
  proxy_per_account: 2,
  account_running: 2, // <=5
}
