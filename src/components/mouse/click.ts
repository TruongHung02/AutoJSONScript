import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { IClickNode, INode } from '../../interface'
import { logger } from '../../helper/logger'

export default async function click(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as IClickNode
  try {
    if (node.options.selectorBy === 'selector') {
      if (node.options.selectorType !== 'xpath') {
        logger.error('Please select element by xpath')
        throw new Error('Click failed')
      } else {
        const clickElement = await pages[activePage].waitForSelector(`::-p-xpath(${node.options.selector})`)
        for (let i = 0; i < node.options.clickCount; i++) {
          await clickElement?.click()
        }
      }
    } else if (node.options.selectorBy === 'coordinates') {
      logger.error('Please select element by xpath')
      throw new Error('Click failed')
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
