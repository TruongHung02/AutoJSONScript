import nextNode, { findNode } from '../next-node'
import { ActionParams, IIfNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function ifAction(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, variables } = actionParams
  const node = findNode(nodeID, nodes) as IIfNode
  try {
    await delay(Number(node.options.nodeSleep))

    //Xử lý vòng lặp While

    const leftOperand = Number(variables.find((variable) => variable.name === node.options.leftOperand)?.value)
    const rightOperand = Number(node.options.rightOperand)
    const operator = node.options.operator

    if (operator === '!=' && rightOperand !== leftOperand) {
      actionParams.nodeID = node.successNode
      nextNode(actionParams)
    } else if (operator === '=' && rightOperand === leftOperand) {
      actionParams.nodeID = node.successNode
      nextNode(actionParams)
    } else if (operator === '>' && leftOperand > rightOperand) {
      actionParams.nodeID = node.successNode
      nextNode(actionParams)
    } else if (operator === '<' && leftOperand < rightOperand) {
      actionParams.nodeID = node.successNode
      nextNode(actionParams)
    } else if (operator === '>=' && leftOperand >= rightOperand) {
      actionParams.nodeID = node.successNode
      nextNode(actionParams)
    } else if (operator === '<=' && leftOperand <= rightOperand) {
      actionParams.nodeID = node.successNode
      nextNode(actionParams)
    } else {
      actionParams.nodeID = node.failNode
      nextNode(actionParams)
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
