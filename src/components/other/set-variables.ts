import nextNode, { findNode } from '../next-node'
import { ActionParams, ISetVariablesNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function setVariable(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, variables } = actionParams
  const node = findNode(nodeID, nodes) as ISetVariablesNode
  try {
    await delay(Number(node.options.nodeSleep))

    if (node.options.setOperator !== '=') {
      throw new Error("set operator must be '='")
    }

    variables.forEach((variable) => {
      if (variable.name === node.options.variableName) {
        variable.value = Number(node.options.variableValue)
      }
      return variable
    })

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
