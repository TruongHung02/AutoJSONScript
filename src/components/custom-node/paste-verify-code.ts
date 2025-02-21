import nextNode, { findNode } from '../next-node'
import { ActionParams, IPasteInputTextNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay, waitForXpathSelector } from '~/until'
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
    const mailServer = customVariables.account.includes('gmail')
      ? 'gmail'
      : customVariables.account.includes('veer')
        ? 'veer'
        : customVariables.account.includes('tourzy')
          ? 'bizflycloud'
          : null

    if (!mailServer) {
      throw new Error('Mail server is not supported')
    }
    const verifyCode = await getOTP(customVariables.account, customVariables.password, mailServer, proxy)
    console.log(verifyCode)
    if (!verifyCode) {
      throw new Error(`Account ${customVariables.account} cant get verify code`)
    }

    // Xử lý riêng selector iframe cho magic newton, selector nằm trong 1 iframe

    const iframe1 = await waitForXpathSelector(page, '/html/body/iframe')
    const iFrameContent1 = await iframe1?.contentFrame()
    if (!iFrameContent1) {
      throw new Error('Cant find iframe')
    }

    const selectorMap = {
      [SELECTOR_TYPE.XPATH]: () => waitForXpathSelector(iFrameContent1, `::-p-xpath(${node.options.selector})`),
      [SELECTOR_TYPE.CSS]: () => iFrameContent1.waitForSelector(node.options.selector),
      [SELECTOR_TYPE.TEXT]: () => iFrameContent1.waitForSelector(`::-p-xpath(${node.options.selector})`),
    }

    const getTextArea = selectorMap[node.options.selectorType]
    if (!getTextArea) throw new Error('Select element failed. Use CSS or XPath')

    const textArea = await getTextArea()
    if (!textArea) throw new Error(`Cant find input text area with selector: ${node.options.selector}`)

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
    logger.error(error as string)
    actionParams.nodeID = node.failNode
    if (actionParams.nodeID) await nextNode(actionParams)
  }
}
