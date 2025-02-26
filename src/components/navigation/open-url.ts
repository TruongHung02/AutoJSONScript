import nextNode, { findNode } from '../next-node'
import { ActionParams, IOpenUrlNode } from '../../interface'
import { logger } from '~/helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function openUrl(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IOpenUrlNode
  try {
    await delay(Number(node.options.nodeSleep))

    await pages[activePage].goto(node.options.url, { waitUntil: 'networkidle2' })

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
