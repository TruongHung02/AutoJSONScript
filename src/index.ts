import { Browser, Page } from 'puppeteer'
import formatNodes from './helper/format-nodes'
import nextNode from './components/next-node'
import { delay } from './until'
import { ActionParams, CustomVariables } from './interface'
import createBrowsers from './helper/create-browser'
import loadProxies from './helper/load-proxy'
import loadWalletKey from './helper/load-wallet-key'

const browsers: Browser[] = [] // Store all browser instances

async function run(browser: Browser, script: string, proxy?: string, customVariables?: CustomVariables) {
  const { formattedNodes: nodes = [], formattedVariables: variables = [] } = (await formatNodes(script)) || {}

  const pages: Page[] = []

  const actionParams: ActionParams = {
    nodeID: nodes[0].successNode,
    nodes,
    browser,
    pages,
    activePage: 0,
    variables,
    proxy,
    customVariables,
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
  const createdBrowsers = await createBrowsers(proxies)

  browsers.push(...createdBrowsers) // Keep track of browsers
  await Promise.all(
    browsers.map(async (browser, idx) => {
      //Xử lý điều kiện đọc các mã ví trước khi
      const walletKeys = await loadWalletKey()

      if (idx < walletKeys.length) {
        run(browser, 'recoverWalletMining.genlogin.json', proxies[idx], { text: walletKeys[idx] })
      } else {
        run(browser, 'auto.genlogin.json', proxies[idx])
      }
    }),
  )
})()
