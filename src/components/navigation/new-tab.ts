import nextNode, { findNode } from '../next-node'
import authProxyPage from '../../helper/auth-proxy-page'
import { ActionParams, INewTabNode } from '../../interface'
import { logger } from '~/helper/logger'
import { config } from '~/config'
import { delay, formatProxy } from '~/until'

export default async function newTab(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as INewTabNode
  try {
    await delay(Number(node.options.nodeSleep))

    const newpage = !proxy
      ? await browser.newPage()
      : await authProxyPage(await browser.newPage(), formatProxy(proxy).user, formatProxy(proxy).password)
    await newpage.setViewport({
      width: Number(config.window_size.split(',')[0]),
      height: Number(config.window_size.split(',')[1]),
    })
    await newpage.goto(node?.options.url, {
      waitUntil: 'networkidle2',
    })

    try {
      const elementError = await newpage.waitForSelector('#reload-button', { timeout: 2000 })
      if (elementError) {
        await browser.close()
        throw new Error(`Proxy error: ${proxy}`)
      }
    } catch (error) {}

    pages.push(newpage)
    actionParams.activePage = pages.length - 1

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
