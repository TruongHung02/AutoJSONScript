import { Browser, Page } from 'puppeteer'
import formatNodes from './helper/format-nodes'
import nextNode from './components/next-node'
import { ActionParams, CustomVariables } from './interface'
import { createBrowser } from './helper/create-browser'
import loadProxies from './helper/load-proxy'
import loadAccount from './helper/load-account'
import loadInput from './helper/load-input'
import { config } from './config'

const browsers: Browser[] = [] // Store all browser instances

async function run(idx: number, script: string, proxy?: string, customVariables?: CustomVariables) {
  const { formattedNodes: nodes = [], formattedVariables: variables = [] } = (await formatNodes(script)) || {}

  //Reset chạy lại script khi hoàn thành hoặc xảy ra lỗi
  while (true) {
    const pages: Page[] = []
    const browser = await createBrowser(idx, proxy)
    browsers.push(browser)

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
    //reset browser
    actionParams.nodeID = nodes[0].successNode
    actionParams.pages = []
    actionParams.activePage = 0
    actionParams.variables = variables

    await browser.close()
  }
}

// Handle Ctrl + C to close all browsers gracefully
async function closeAllBrowsers() {
  console.log('\nClosing all browsers...')
  await Promise.all(browsers.map((browser) => browser.close()))
  process.exit()
}

process.on('SIGINT', closeAllBrowsers)
;(async () => {
  const proxies = (await loadProxies()).slice(0, config.account_running * config.proxy_per_account)
  // const createdBrowsers = await createBrowsers(proxies)
  const accounts = await loadAccount()
  const input = await loadInput()
  // browsers.push(...createdBrowsers) // Keep track of browsers
  await Promise.all(
    proxies.map(async (proxy, idx) => {
      //Xử lý điều kiện đọc các mã ví trước khi

      run(idx, 'login_report_gradient.genlogin.json', proxies[idx], {
        // run(browser, 'testHttp.genlogin.json', proxies[idx], {
        account: accounts[idx % config.account_running].split(':')[0],
        password: accounts[idx % config.account_running].split(':')[1],
        input: input[idx % config.account_running],
      })
    }),
  )
})()
