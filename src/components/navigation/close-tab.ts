import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { ICloseTabNode, INode } from '../../interface'
import { logger } from '~/helper/logger'

export default async function closeTab(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as ICloseTabNode
  try {
    if (node.options.closeType === 'current') {
      await pages[activePage].close()
    } else {
      await pages[node.options.tabNumber].close()
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
