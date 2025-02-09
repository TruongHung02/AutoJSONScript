import nextNode, { findNode } from '../next-node'
import { ActionParams, ILoopNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function click(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as ILoopNode
  try {
    await delay(Number(node.options.nodeSleep))

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }

    if (node?.successNode) {
      await nextNode(actionParams)
    }
  } catch (error) {
    logger.error(error as string)
    if (node?.failNode) {
      await nextNode(actionParams)
    }
  }
}
