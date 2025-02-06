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
    if (node.options.selectorType !== 'css') {
      logger.error('Please select element by css selector')
      throw new Error('Select element failed')
    } else {
      const textArea = await pages[activePage].waitForSelector(
        // { timeout: 5000 },
        node.options.selector,
      )
      if (!textArea) {
        throw new Error(`Cant find input text area with selector: ${node.options.selector}`)
      } else {
        await textArea.type(node.options.text, { delay: 100 })
      }
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
