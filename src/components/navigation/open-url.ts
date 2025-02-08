import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { INode, IOpenUrlNode } from '../../interface'
import { logger } from '~/helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function openUrl(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as IOpenUrlNode
  try {
    await delay(Number(node.options.nodeSleep))

    await pages[activePage].goto(node.options.url)

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }

    if (node?.successNode) {
      await nextNode(node.successNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  } catch (error) {
    logger.error(error as string)
    if (node?.failNode) {
      await nextNode(node.failNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  }
}
