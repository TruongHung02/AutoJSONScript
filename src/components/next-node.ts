import { Browser, Page } from "puppeteer";
import { ActionEnum } from "../enum";
import { INewTabNode, INode } from "../interface";
import newTab from "./new-tab";
import activateTab from "./activate-tab";
import closeTab from "./close-tab";
import openUrl from "./open-url";
import reloadPage from "./reload-page";
import goBack from "./go-back";
import { logger } from "../helper/logger";

const actionHandlers = {
  [ActionEnum.NEWTAB]: newTab,
  [ActionEnum.ACTIVATE_TAB]: activateTab,
  [ActionEnum.CLOSE_TAB]: closeTab,
  [ActionEnum.OPEN_URL]: openUrl,
  [ActionEnum.RELOAD_PAGE]: reloadPage,
  [ActionEnum.GO_BACK]: goBack,
} as const;

export default async function nextNode(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string
) {
  try {
    const node: INode | undefined = findNode(nodeID, nodes);
    if (!node) throw new Error("Node does not exist");
    const handler = actionHandlers[node.action];
    if (handler) {
      await handler(nodeID, nodes, browser, pages, activePage, proxy);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error(error as string);
    }
  }
}

export function findNode(nodeID: string | null, nodes: INode[]) {
  if (!nodeID) {
    return undefined;
  }
  const node = nodes.find((node) => node.id === nodeID);
  return node;
}
