import { Browser, ElementHandle, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { INode, ITypeTextNode } from '../../interface'
import { logger } from '../../helper/logger'
import { SELECTOR_TYPE } from '~/const'
import { waitForXpathSelector } from '~/until'

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
    let textArea: ElementHandle<Element> | null = null
    if (node.options.selectorType === SELECTOR_TYPE.XPATH) {
      textArea = await waitForXpathSelector(pages[activePage], `::-p-xpath(${node.options.selector})`)
      // textArea = await pages[activePage].waitForSelector(node.options.selector)
    } else if (node.options.selectorType === SELECTOR_TYPE.CSS) {
      textArea = await pages[activePage].waitForSelector(node.options.selector)
    } else {
      throw new Error('Select element failed. Select element by CSS Selector or Xpath Selector')
    }

    if (!textArea) {
      throw new Error(`Cant find input text area with selector: ${node.options.selector}`)
    } else {
      await textArea.type(node.options.text, { delay: 100 })
      await textArea.dispose()
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
