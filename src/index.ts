import { Page } from 'puppeteer'
import createBrowser from './helper/create-browser'
import { delay } from './until'
import formatNodes from './helper/format-nodes'
import nextNode from './components/next-node'
import { config } from './config'

// (async () => {
//   // const browser = await createBrowser("user:1735970485@157.66.252.255:41235");
//   const browser = await createBrowser();

//   await newTab(browser, "https://youtube.com");

//   await browser.close();
// })();
;(async () => {
  const nodes = await formatNodes()
  const pages: Page[] = []
  const activePage: number = 0

  const browser = config.useProxy ? await createBrowser(config.proxy) : await createBrowser()

  await nextNode(nodes[0].successNode, nodes, browser, pages, activePage)

  await delay(2000)
  await browser.close()
})()
