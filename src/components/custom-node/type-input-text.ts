import nextNode, { findNode } from '../next-node'
import { ActionParams, ITypeInputTextNode } from '../../interface'
import { logger } from '../../helper/logger'
import { SELECTOR_TYPE } from '~/const'
import { delay, waitForXpathSelector } from '~/until'
import { config } from '~/config'

export default async function typeInputText(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, customVariables } = actionParams
  const node = findNode(nodeID, nodes) as ITypeInputTextNode
  const page = pages[activePage]
  try {
    await delay(Number(node.options.nodeSleep))
    const selectorMap = {
      [SELECTOR_TYPE.XPATH]: () => waitForXpathSelector(page, node.options.selector),
      [SELECTOR_TYPE.CSS]: () => page.waitForSelector(node.options.selector),
      [SELECTOR_TYPE.TEXT]: () => page.waitForSelector(`::-p-text(${node.options.selector})`),
    }

    const getTextArea = selectorMap[node.options.selectorType]
    if (!getTextArea) throw new Error('Select element failed. Use CSS or XPath')

    const textArea = await getTextArea()
    if (!textArea) throw new Error(`Cant find input text area with selector: ${node.options.selector}`)

    const descriptionIndex = Number(node.options.description)

    if (node.options.description === undefined || isNaN(descriptionIndex) || descriptionIndex < 0) {
      throw new Error('node option description must be defined as an ordinal number of input, starting from 0')
    }

    if (customVariables?.input) {
      const inputParts = customVariables.input.split(' ')

      if (descriptionIndex >= inputParts.length) {
        throw new Error('node option description index is out of bounds')
      }

      const input = inputParts[descriptionIndex]
      await textArea.type(input)
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
