import { ElementHandle } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { ActionParams, IElementExistNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay, waitForXpathSelector } from '~/until'
import { SELECTOR_TYPE } from '~/const'
import { config } from '~/config'

export default async function elementExist(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IElementExistNode
  try {
    await delay(Number(node.options.nodeSleep))

    let element: ElementHandle<Element> | null = null

    if (node.options.selectorType === SELECTOR_TYPE.XPATH) {
      element = await waitForXpathSelector(pages[activePage], `::-p-xpath(${node.options.selector})`)
    } else if (node.options.selectorType === SELECTOR_TYPE.CSS) {
      element = await pages[activePage].waitForSelector(node.options.selector)
    } else {
      throw new Error(`Element with selector ${node.options.selector} does not exist`)
    }

    if (element) {
      if (node?.successNode) {
        actionParams.nodeID = node?.successNode
        await nextNode(actionParams)
      }
      await element.dispose()
    }

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }
  } catch (error) {
    logger.error(error as string)
    if (node?.failNode) {
      actionParams.nodeID = node?.failNode
      await nextNode(actionParams)
    }
  }
}
