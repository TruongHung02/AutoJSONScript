import puppeteer, { Browser } from 'puppeteer'
import { config } from '../config'
import path from 'path'
import { delay } from '~/until'

export async function createBrowser(idx: number, proxyString?: string): Promise<Browser> {
  const pathToExtension = config.extensions.map((extension) => path.join(process.cwd(), 'extensions', extension))

  const maxCol = Math.floor(Number(config.screen_resolution.split(',')[0]) / Number(config.window_size.split(',')[0]))
  const maxRow = Math.floor(Number(config.screen_resolution.split(',')[1]) / Number(config.window_size.split(',')[1]))
  const maxGrid = maxCol * maxRow
  const position = idx % maxGrid
  const positionCol = position % maxCol
  const positionRow = Math.floor(position / maxCol)
  console.log('positon:' + position)
  console.log('positonCol:' + positionCol)
  console.log('positonRow:' + positionRow)
  const x = positionCol * Number(config.window_size.split(',')[0])
  const y = positionRow * Number(config.window_size.split(',')[1])

  const argsLaunchOption = [
    `--user-agent=${config.USER_AGENT}`,
    '--enable-cookies',
    '--enable-javascript',
    `--window-position=${x},${y}`,
    `--window-size=${config.window_size}`,
    'accept=text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
    '--enable-features=ClipboardAPI',
    '--disable-infobars',
  ]

  if (proxyString) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    const [proxyUsername, proxyPassword, IpAddress, port] = proxyString.split(/[@:]/)

    argsLaunchOption.push(`--proxy-server=${IpAddress}:${port}`)
  }

  const browser = await puppeteer.launch({
    executablePath: config.EXECUTABLE_PATH, // Adjust this path based on your system
    headless: config.headless,
    args: argsLaunchOption,
  })

  await delay(3)
  const pages = await browser.pages()
  if (pages.length > 1) {
    for (let i = 1; i < pages.length; i++) {
      await pages[i].close()
    }
  }
  return browser
}

export default async function createBrowsers(proxies: string[]) {
  const createdBrowsers =
    config.useProxy && proxies.length
      ? await Promise.all(proxies.map((proxy, idx) => createBrowser(idx, proxy)))
      : [await createBrowser(0)]
  return createdBrowsers
}
