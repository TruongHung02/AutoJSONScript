import nextNode, { findNode } from '../next-node'
import { ActionParams, IElementExistNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { SELECTOR_TYPE } from '~/const'
import { config } from '~/config'

export default async function elementExist(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IElementExistNode
  const page = pages[activePage]
  try {
    await delay(Number(node.options.nodeSleep))

    const selectorMap = {
      [SELECTOR_TYPE.XPATH]: () =>
        page.waitForSelector(`::-p-xpath(${node.options.selector})`, { timeout: node.options.nodeTimeout }),
      [SELECTOR_TYPE.CSS]: () => page.waitForSelector(node.options.selector, { timeout: node.options.nodeTimeout }),
      [SELECTOR_TYPE.TEXT]: () =>
        page.waitForSelector(`::-p-text(${node.options.selector})`, { timeout: node.options.nodeTimeout }),
    }

    const element = await selectorMap[node.options.selectorType]()

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
    logger.error(`Account: ${actionParams.customVariables?.account} ${error}`)
    if (node?.failNode) {
      actionParams.nodeID = node?.failNode
      await nextNode(actionParams)
    }
  }
}
