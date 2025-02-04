import { Browser, Page } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import authProxyPage from '../../helper/auth-proxy-page'
import { INewTabNode, INode } from '../../interface'
import { logger } from '~/helper/logger'

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
    await newpage.goto(node?.options.url)
    await newpage.waitForNetworkIdle()

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
