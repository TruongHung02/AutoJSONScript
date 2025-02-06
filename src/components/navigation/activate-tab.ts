import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { IActivateTabNode, INode } from '../../interface'
import { logger } from '~/helper/logger'

export default async function activateTab(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as IActivateTabNode
  try {
    await pages[node.options.tabNumber].bringToFront()
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
