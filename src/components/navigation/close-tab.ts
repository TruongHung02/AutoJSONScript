import nextNode, { findNode } from '../next-node'
import { ActionParams, ICloseTabNode } from '../../interface'
import { logger } from '~/helper/logger'
import { delay } from '~/until'

export default async function closeTab(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as ICloseTabNode
  try {
    await delay(Number(node.options.nodeSleep))

    if (node.options.closeType === 'current') {
      await pages[activePage].close()
    } else {
      await pages[node.options.tabNumber].close()
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
