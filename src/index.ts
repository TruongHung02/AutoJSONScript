import { Page } from 'puppeteer'
import createBrowser from './helper/create-browser'
import formatNodes from './helper/format-nodes'
import nextNode from './components/next-node'
import { delay } from './until'
import { config } from './config'
import { ActionParams } from './interface'
;(async () => {
  const browser = await createBrowser(config.useProxy ? config.proxy : undefined)
  const nodes = await formatNodes()
  const pages: Page[] = []

  const actionParams: ActionParams = {
    nodeID: nodes[0].successNode,
    nodes,
    browser,
    pages,
    activePage: 0,
  }

  await nextNode(actionParams)

  await delay(10_000)
  await browser.close()
})()
