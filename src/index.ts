import { Browser, Page } from 'puppeteer'
import createBrowser from './helper/create-browser'
import formatNodes from './helper/format-nodes'
import nextNode from './components/next-node'
import { delay } from './until'
import { config } from './config'
import { ActionParams } from './interface'
import loadProxies from './helper/load-proxy'

async function run(browser: Browser) {
  const { formattedNodes: nodes = [], formattedVariables: variables = [] } = (await formatNodes()) || {}

  const pages: Page[] = []

  const actionParams: ActionParams = {
    nodeID: nodes[0].successNode,
    nodes,
    browser,
    pages,
    activePage: 0,
    variables,
  }

  await nextNode(actionParams)

  await delay(10_000)
  await browser.close()
}

;(async () => {
  const proxies = await loadProxies()
  // const browser = await createBrowser(config.useProxy ? config.proxy : undefined)
  const browsers =
    config.useProxy && proxies.length
      ? await Promise.all(proxies.map((proxy) => createBrowser(proxy)))
      : [await createBrowser()]

  Promise.all(browsers.map((browser) => run(browser)))
})()
