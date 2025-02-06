import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import authProxyPage from '../../helper/auth-proxy-page'
import { INewTabNode, INode } from '../../interface'
import { logger } from '~/helper/logger'
import { config } from '~/config'

export default async function newTab(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  const node = findNode(nodeID, nodes) as INewTabNode
  try {
    const newpage = !proxy ? await browser.newPage() : await authProxyPage(await browser.newPage(), 'user', 'password')
    await newpage.setViewport({
      width: Number.parseInt(config.window_size.split(',')[0]),
      height: Number.parseInt(config.window_size.split(',')[1]),
    })
    await newpage.goto(node?.options.url, {
      waitUntil: 'networkidle2',
    })

    pages.push(newpage)
    activePage = pages.length - 1

    if (node?.successNode) {
      await nextNode(node?.successNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  } catch (error) {
    if (node?.failNode) {
      logger.error(error as string)
      await nextNode(node.failNode, nodes, browser, pages, activePage, proxy || undefined)
    }
  }
}
