import nextNode, { findNode } from '../next-node'
import { ActionParams, IActivateTabNode } from '../../interface'
import { logger } from '~/helper/logger'
import { delay } from '~/until'
import { config } from '~/config'

export default async function activateTab(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IActivateTabNode
  try {
    await delay(Number(node.options.nodeSleep) + 3)

    actionParams.pages = await browser.pages()

    if (node.options.selectType === 'index') {
      await actionParams.pages[Number(node.options.tabNumber)].bringToFront()
      actionParams.activePage = Number(node.options.tabNumber)
    }
    if (node.options.selectType === 'string') {
      for (const [idx, page] of actionParams.pages.entries()) {
        const url1 = page.url()
        if (url1.includes(node.options.patternUrl)) {
          actionParams.activePage = idx
          await page.bringToFront()
          await page.setViewport({
            width: Number(config.window_size.split(',')[0]),
            height: Number(config.window_size.split(',')[1]),
          })
          break
        }
      }
    }

    if (config.screenshot) {
      await actionParams.pages[actionParams.activePage].screenshot({ path: 'screenshot.png' })
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
