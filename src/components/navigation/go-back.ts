import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { INode, IReloadPageNode } from '../../interface'
import { logger } from '~/helper/logger'

export default async function goBack(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as IReloadPageNode
  try {
    await pages[activePage].goBack()

    if (node?.successNode) {
      await nextNode(node?.successNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  } catch (error) {
    if (node?.failNode) {
      logger.error(error as string)
      await nextNode(node.failNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  }
}
