import nextNode, { findNode } from '../next-node'
import { ActionParams, IReloadPageNode } from '../../interface'
import { logger } from '~/helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function goBack(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IReloadPageNode
  try {
    await delay(Number(node.options.nodeSleep))

    await pages[activePage].goBack()

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }

    if (node?.successNode) {
      actionParams.nodeID = node?.successNode
      await nextNode(actionParams)
    }
  } catch (error) {
    logger.error(`Account: ${actionParams.customVariables?.account} ${error}`)
    if (node?.failNode) {
      actionParams.nodeID = node?.failNode
      await nextNode(actionParams)
    }
  }
}
