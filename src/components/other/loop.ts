import nextNode, { findNode } from '../next-node'
import { ActionParams, ILoopNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function loop(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, variables } = actionParams
  const node = findNode(nodeID, nodes) as ILoopNode
  try {
    await delay(Number(node.options.nodeSleep))

    //Xử lý vòng lặp While
    if (node.options.loopType === 'While') {
      const leftOperand = Number(variables.find((variable) => variable.name === node.options.leftOperand)?.value)
      const rightOperand = Number(node.options.rightOperand)
      const operator = node.options.operator

      if (operator === '!=' && rightOperand !== leftOperand) {
        actionParams.nodeID = node.startLoopNode
        nextNode(actionParams)
      } else if (operator === '=' && rightOperand === leftOperand) {
        actionParams.nodeID = node.startLoopNode
        nextNode(actionParams)
      } else if (operator !== '!=' && operator !== '=') {
        throw new Error('Chỉ hỗ trợ so sánh != và = ')
      } else {
        actionParams.nodeID = node.failNode
        nextNode(actionParams)
      }

      //Xử lý vòng lặp For
    } else if (node.options.loopType === 'For') {
      throw new Error('For Loop type not defined')
    } else {
      throw new Error('Loop type not defined')
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
