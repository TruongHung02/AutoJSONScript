import nextNode, { findNode } from '../next-node'
import { ActionParams, IPasteInputTextNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'
import { SELECTOR_TYPE } from '~/const'
import getOTP from '~/helper/get-otp'

export default async function pasteVerifyCode(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, customVariables } = actionParams
  const node = findNode(nodeID, nodes) as IPasteInputTextNode
  const page = pages[activePage] // Tối ưu truy cập

  try {
    await delay(Number(node.options.nodeSleep))
    if (!customVariables?.account || !customVariables?.password) {
      throw new Error('Account info is not provided')
    }

    const verifyCode = await getOTP(customVariables.account, customVariables.password, proxy)
    console.log(verifyCode)
    if (!verifyCode) {
      throw new Error(`Account ${customVariables.account} cant get verify code`)
    }

    const selectorMap = {
      [SELECTOR_TYPE.XPATH]: () =>
        page.waitForSelector(`::-p-xpath(${node.options.selector})`, { timeout: node.options.nodeTimeout }),
      [SELECTOR_TYPE.CSS]: () => page.waitForSelector(node.options.selector, { timeout: node.options.nodeTimeout }),
      [SELECTOR_TYPE.TEXT]: () =>
        page.waitForSelector(`::-p-text(${node.options.selector})`, { timeout: node.options.nodeTimeout }),
    }

    const getTextArea = selectorMap[node.options.selectorType]
    if (!getTextArea)
      throw new Error(`Account: ${actionParams.customVariables?.account} Select element failed. Use CSS or XPath`)

    const textArea = await getTextArea()
    if (!textArea)
      throw new Error(
        `Account: ${actionParams.customVariables?.account} Cant find input text area with selector: ${node.options.selector}`,
      )

    const context = browser.defaultBrowserContext()
    await context.overridePermissions(page.url(), ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write'])

    await page.evaluate((text) => navigator.clipboard.writeText(text), verifyCode)
    await textArea.click()

    await page.keyboard.down('Control')
    await page.keyboard.press('V')
    await page.keyboard.up('Control')

    if (config.screenshot) await page.screenshot({ path: 'screenshot.png' })

    actionParams.nodeID = node.successNode ?? node.failNode
    if (actionParams.nodeID) await nextNode(actionParams)
  } catch (error) {
    logger.error(`Account: ${actionParams.customVariables?.account} ${error}`)
    actionParams.nodeID = node.failNode
    if (actionParams.nodeID) await nextNode(actionParams)
  }
}
