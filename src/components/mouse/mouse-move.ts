import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { IMouseMoveNode, INode } from '../../interface'
import { logger } from '../../helper/logger'

export default async function mouseMove(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as IMouseMoveNode
  try {
    await pages[activePage].mouse.move(node.options.x, node.options.y, { steps: 3 })

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
