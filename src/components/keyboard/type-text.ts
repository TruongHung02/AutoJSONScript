import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { INode, ITypeTextNode } from '../../interface'
import { logger } from '../../helper/logger'

export default async function typeText(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as ITypeTextNode
  try {
    if (node.options.selectorType !== 'xpath') {
      logger.error('Please select element by xpath')
      throw new Error('Select element failed')
    } else {
      const textArea = await pages[activePage].waitForSelector(`::-p-xpath(${node.options.selector})`)
      await textArea?.type(node.options.text, { delay: 100 })
    }

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
