import { ElementHandle } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { ActionParams, ITypeInputTextNode } from '../../interface'
import { logger } from '../../helper/logger'
import { SELECTOR_TYPE } from '~/const'
import { delay, waitForXpathSelector } from '~/until'
import { config } from '~/config'

export default async function typeInputText(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, customVariables } = actionParams
  const node = findNode(nodeID, nodes) as ITypeInputTextNode
  try {
    await delay(Number(node.options.nodeSleep))

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
    } else if (customVariables?.text) {
      await textArea.type(customVariables.text, { delay: 100 })
      await textArea.dispose()
    }

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }

    if (node?.successNode) {
      actionParams.nodeID = node?.successNode
      await nextNode(actionParams)
    }
  } catch (error) {
    logger.error(error as string)
    if (node?.failNode) {
      actionParams.nodeID = node?.failNode
      await nextNode(actionParams)
    }
  }
}
