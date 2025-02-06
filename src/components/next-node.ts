import { Browser, Page } from 'puppeteer'
import { INode } from '../interface'
import newTab from './navigation/new-tab'
import activateTab from './navigation/activate-tab'
import closeTab from './navigation/close-tab'
import openUrl from './navigation/open-url'
import reloadPage from './navigation/reload-page'
import goBack from './navigation/go-back'
import { logger } from '../helper/logger'
import { ACTION } from '../const'
import click from './mouse/click'
import typeText from './keyboard/type-text'
import pressKey from './keyboard/press-key'

const actionHandlers = {
  [ACTION.NEWTAB]: newTab,
  [ACTION.ACTIVATE_TAB]: activateTab,
  [ACTION.CLOSE_TAB]: closeTab,
  [ACTION.OPEN_URL]: openUrl,
  [ACTION.RELOAD_PAGE]: reloadPage,
  [ACTION.GO_BACK]: goBack,
  [ACTION.CLICK]: click,
  [ACTION.TYPE_TEXT]: typeText,
  [ACTION.PRESS_KEY]: pressKey,
} as const

export default async function nextNode(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string,
) {
  try {
    const node: INode | undefined = findNode(nodeID, nodes)
    if (!node) throw new Error('Node does not exist')
    const handler = actionHandlers[node.action]
    if (!handler) {
      throw new Error(`Action ${node.action} is not defined`)
    }
    if (handler) {
      logger.info(`Start node: ID: ${node.id} Action: ${node.action}`)
      await handler(nodeID, nodes, browser, pages, activePage, proxy)
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    } else {
      logger.error(error as string)
    }
  }
}

export function findNode(nodeID: string | null, nodes: INode[]) {
  if (!nodeID) {
    return undefined
  }
  const node = nodes.find((node) => node.id === nodeID)
  return node
}
