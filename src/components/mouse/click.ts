import nextNode, { findNode } from '../next-node'
import { ActionParams, IClickNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay, waitForXpathSelector } from '~/until'
import { SELECTOR_TYPE } from '~/const'
import { config } from '~/config'
import { promises as fs } from 'fs'

export default async function click(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IClickNode
  const page = pages[activePage] // Tối ưu truy cập
  try {
    await delay(Number(node.options.nodeSleep))
    console.log('time out: ' + Number(node.options.nodeTimeout) * 1000)
    //Test

    if (node.options.selectorBy === 'selector') {
      const selectorMap = {
        [SELECTOR_TYPE.XPATH]: () =>
          waitForXpathSelector(page, node.options.selector, Number(node.options.nodeTimeout)),
        [SELECTOR_TYPE.CSS]: () =>
          page.waitForSelector(node.options.selector, { timeout: Number(node.options.nodeTimeout) * 1000 }),
        [SELECTOR_TYPE.TEXT]: () =>
          page.waitForSelector(`::-p-text(${node.options.selector})`, {
            timeout: Number(node.options.nodeTimeout) * 1000,
          }),
      }

      const getClickElement = selectorMap[node.options.selectorType]
      if (!getClickElement) throw new Error('Select element failed. Use CSS or XPath')
      const clickElement = await getClickElement()

      if (clickElement) {
        for (let i = 0; i < node.options.clickCount; i++) {
          await clickElement.click()

          //Nếu click để copy
          if (node.options.description === 'copy') {
            const context = browser.defaultBrowserContext()
            await context.overridePermissions(pages[activePage].url(), ['clipboard-read'])

            const clipboardText = await pages[activePage].evaluate(async () => {
              return await navigator.clipboard.readText()
            })
            console.log(clipboardText)

            await fs.writeFile(process.cwd() + '/clipboard.txt', clipboardText + '\n', { flag: 'a' })
          }
        }
        await clickElement.dispose()
      }
    } else if (node.options.selectorBy === 'coordinates') {
      throw new Error('Please select element by CSS selector')
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
