import { Browser, ElementHandle, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { IClickNode, INode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay, waitForXpathSelector } from '~/until'
import { SELECTOR_TYPE } from '~/const'
import { config } from '~/config'

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
    await delay(Number(node.options.nodeSleep))

    if (node.options.selectorBy === 'selector') {
      let clickElement: ElementHandle<Element> | null = null

      if (node.options.selectorType === SELECTOR_TYPE.XPATH) {
        clickElement = await waitForXpathSelector(pages[activePage], `::-p-xpath(${node.options.selector})`)
      } else if (node.options.selectorType === SELECTOR_TYPE.CSS) {
        clickElement = await pages[activePage].waitForSelector(node.options.selector)
      } else {
        throw new Error('Click failed. Please select element by CSS selector or Xpath selector')
      }

      if (clickElement) {
        for (let i = 0; i < node.options.clickCount; i++) {
          await clickElement.click()
        }
        await clickElement.dispose()
      }
    } else if (node.options.selectorBy === 'coordinates') {
      throw new Error('Please select element by CSS selector')
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
