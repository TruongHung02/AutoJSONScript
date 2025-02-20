import { ActionParams, INode } from '../interface'
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
import mouseMove from './mouse/mouse-move'
import scroll from './mouse/scroll'
import loop from './other/loop'
import setVariable from './other/set-variables'
import ifAction from './other/if'
import elementExist from './other/element-exist'
import typeInputText from './custom-node/type-input-text'
import pasteWithInput from './custom-node/paste-with-input'
import pasteVerifyCode from './custom-node/paste-verify-code'

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
  [ACTION.MOUSE_MOVE]: mouseMove,
  [ACTION.SCROLL]: scroll,
  [ACTION.LOOP]: loop,
  [ACTION.SET_VARIABLE]: setVariable,
  [ACTION.IF]: ifAction,
  [ACTION.ELEMENT_EXISTS]: elementExist,
  [ACTION.TYPE_INPUT_TEXT]: typeInputText,
  [ACTION.PASTE_WITH_INPUT]: pasteWithInput,
  [ACTION.PASTE_VERIFY_CODE]: pasteVerifyCode,
} as const

export default async function nextNode(actionParams: ActionParams) {
  try {
    const node: INode | undefined = findNode(actionParams.nodeID, actionParams.nodes)
    if (!node) throw new Error(`${actionParams.nodeID} Node does not exist`)
    const handler = actionHandlers[node.action]
    if (!handler) {
      throw new Error(`Action ${node.action} is not defined`)
    }
    if (handler) {
      logger.info(`Action: ${node.action} Description: ${node.options.description}`)
      await handler(actionParams)
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
