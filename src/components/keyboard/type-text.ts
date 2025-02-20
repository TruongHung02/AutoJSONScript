import nextNode, { findNode } from '../next-node'
import { ActionParams, ITypeTextNode } from '../../interface'
import { logger } from '../../helper/logger'
import { SELECTOR_TYPE } from '~/const'
import { delay, waitForXpathSelector } from '~/until'
import { config } from '~/config'

export default async function typeText(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as ITypeTextNode
  const page = pages[activePage] // Tối ưu truy cập
  try {
    await delay(Number(node.options.nodeSleep))

    const selectorMap = {
      [SELECTOR_TYPE.XPATH]: () => waitForXpathSelector(page, node.options.selector),
      [SELECTOR_TYPE.CSS]: () => page.waitForSelector(node.options.selector),
      [SELECTOR_TYPE.TEXT]: () => page.waitForSelector(`::-p-text(${node.options.selector})`),
    }

    const getTextArea = selectorMap[node.options.selectorType]
    if (!getTextArea) throw new Error('Select element failed. Use CSS or XPath')

    const textArea = await getTextArea()

    if (!textArea) {
      throw new Error(`Cant find input text area with selector: ${node.options.selector}`)
    } else {
      await textArea.type(node.options.text, { delay: 100 })
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
