import puppeteer, { Browser } from 'puppeteer'
import { config } from '../config'
import path from 'path'
import { delay } from '~/until'

export async function createBrowser(proxyString?: string): Promise<Browser> {
  const pathToExtension = config.extensions.map((extension) => path.join(process.cwd(), 'extensions', extension))

  const argsLaunchOption = [
    `--user-agent=${config.USER_AGENT}`,
    '--enable-cookies',
    '--enable-javascript',
    `--window-size=${config.window_size}`,
    'accept=text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
    '--enable-features=ClipboardAPI',
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
      ? await Promise.all(proxies.map((proxy) => createBrowser(proxy)))
      : [await createBrowser()]
  return createdBrowsers
}
