import { Browser, Page } from 'puppeteer'
import createBrowser from './helper/create-browser'
import formatNodes from './helper/format-nodes'
import nextNode from './components/next-node'
import { delay } from './until'
import { config } from './config'
import { ActionParams } from './interface'
import loadProxies from './helper/load-proxy'

const browsers: Browser[] = [] // Store all browser instances

async function run(browser: Browser, proxy?: string) {
  const { formattedNodes: nodes = [], formattedVariables: variables = [] } = (await formatNodes()) || {}

  const pages: Page[] = []

  const actionParams: ActionParams = {
    nodeID: nodes[0].successNode,
    nodes,
    browser,
    pages,
    activePage: 0,
    variables,
    proxy,
  }

  await nextNode(actionParams)

  await delay(10_000)
  await browser.close()
}

// Handle Ctrl + C to close all browsers gracefully
async function closeAllBrowsers() {
  console.log('\nClosing all browsers...')
  await Promise.all(browsers.map((browser) => browser.close()))
  process.exit()
}

process.on('SIGINT', closeAllBrowsers)
;(async () => {
  const proxies = await loadProxies()
  const createdBrowsers =
    config.useProxy && proxies.length
      ? await Promise.all(proxies.map((proxy) => createBrowser(proxy)))
      : [await createBrowser()]

  browsers.push(...createdBrowsers) // Keep track of browsers
  await Promise.all(browsers.map((browser, idx) => run(browser, proxies[idx])))
})()
