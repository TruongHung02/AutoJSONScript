import nextNode, { findNode } from '../next-node'
import { ActionParams, IPressKeyNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function pressKey(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IPressKeyNode
  try {
    await delay(Number(node.options.nodeSleep))

    if (node.options.key.length) {
      for (const key of node.options.key) {
        await pages[activePage].keyboard.press(key, { delay: 100 })
      }
    }

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
