import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { INode, IPressKeyNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function pressKey(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as IPressKeyNode
  try {
    await delay(Number(node.options.nodeSleep))

    if (node.options.key.length) {
      for (const key of node.options.key) {
        await pages[activePage].keyboard.press(key, { delay: 100 })
      }
    }

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }

    if (node?.successNode) {
      await nextNode(node?.successNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  } catch (error) {
    logger.error(error as string)
    if (node?.failNode) {
      await nextNode(node.failNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  }
}
