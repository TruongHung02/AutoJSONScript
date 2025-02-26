import nextNode, { findNode } from '../next-node'
import { ActionParams, IGetValueNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay, waitForXpathSelector } from '~/until'
import { SELECTOR_TYPE } from '~/const'
import { config } from '~/config'

export default async function getValue(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, variables } = actionParams
  const node = findNode(nodeID, nodes) as IGetValueNode
  const page = pages[activePage] // Tối ưu truy cập
  try {
    await delay(Number(node.options.nodeSleep))

    const selectorMap = {
      [SELECTOR_TYPE.XPATH]: () => waitForXpathSelector(page, node.options.selector, Number(node.options.nodeTimeout)),
      [SELECTOR_TYPE.CSS]: () =>
        page.waitForSelector(node.options.selector, { timeout: Number(node.options.nodeTimeout) * 1000 }),
      [SELECTOR_TYPE.TEXT]: () =>
        page.waitForSelector(`::-p-text(${node.options.selector})`, {
          timeout: Number(node.options.nodeTimeout) * 1000,
        }),
    }

    const getValueElement = selectorMap[node.options.selectorType]
    if (!getValueElement) throw new Error('Select element failed. Use CSS or XPath')
    const valueElement = await getValueElement()

    if (valueElement) {
      const changeVarIdx = actionParams.variables.findIndex((variable) => variable.name === node.options.outputVariable)
      if (changeVarIdx !== -1) {
        actionParams.variables[changeVarIdx].value = Number(await page.evaluate((el) => el.textContent, valueElement))
        console.log(actionParams.variables[changeVarIdx].value)
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
