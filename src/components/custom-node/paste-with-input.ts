import nextNode, { findNode } from '../next-node'
import { ActionParams, IPasteInputTextNode } from '../../interface'
import { logger } from '../../helper/logger'
import { SELECTOR_TYPE } from '~/const'
import { delay, waitForXpathSelector } from '~/until'
import { config } from '~/config'

export default async function pasteWithInput(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, customVariables } = actionParams
  const node = findNode(nodeID, nodes) as IPasteInputTextNode
  const page = pages[activePage] // Tối ưu truy cập

  try {
    await delay(Number(node.options.nodeSleep))

    const selectorMap = {
      [SELECTOR_TYPE.XPATH]: () => waitForXpathSelector(page, node.options.selector),
      [SELECTOR_TYPE.CSS]: () => page.waitForSelector(node.options.selector),
      [SELECTOR_TYPE.TEXT]: () => page.waitForSelector(`::-p-text(${node.options.selector})`),
    }

    const getTextArea = selectorMap[node.options.selectorType]
    if (!getTextArea)
      throw new Error(`Account: ${actionParams.customVariables?.account} Select element failed. Use CSS or XPath`)

    const textArea = await getTextArea()
    if (!textArea)
      throw new Error(
        `Account: ${actionParams.customVariables?.account} Cant find input text area with selector: ${node.options.selector}`,
      )

    if (customVariables?.input) {
      const context = browser.defaultBrowserContext()
      await context.overridePermissions(page.url(), ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write'])

      const descriptionIndex = Number(node.options.description)

      if (node.options.description === undefined || isNaN(descriptionIndex) || descriptionIndex < 0) {
        throw new Error('node option description must be defined as an ordinal number of input, starting from 0')
      }

      const inputParts = customVariables.input.split(' ')

      if (descriptionIndex >= inputParts.length) {
        throw new Error('node option description index is out of bounds')
      }

      const input = inputParts[descriptionIndex]

      await page.bringToFront()
      await page.evaluate((input) => navigator.clipboard.writeText(input), input)
      await textArea.click()

      await page.keyboard.down('Control')
      await page.keyboard.press('V')
      await page.keyboard.up('Control')
    }

    if (config.screenshot) await page.screenshot({ path: 'screenshot.png' })

    actionParams.nodeID = node.successNode ?? node.failNode
    if (actionParams.nodeID) await nextNode(actionParams)
  } catch (error) {
    logger.error(`Account: ${actionParams.customVariables?.account} ${error}`)
    actionParams.nodeID = node.failNode
    if (actionParams.nodeID) await nextNode(actionParams)
  }
}
