import { Browser, Page } from "puppeteer";
import { ActionEnum } from "../enum";
import { INewTabNode, INode } from "../interface";
import newTab from "./newTab";
import activateTab from "./activateTab";

export default async function nextNode(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string
) {
  const node = findNode(nodeID, nodes);
  if (!node) return;
  switch (node.action) {
    case ActionEnum.NEWTAB:
      await newTab(nodeID, nodes, browser, pages, activePage);
    case ActionEnum.ACTIVATE_TAB:
      await activateTab(nodeID, nodes, browser, pages, activePage);
    default:
      return;
  }
}

export function findNode(nodeID: string | null, nodes: INode[]) {
  if (!nodeID) {
    return undefined;
  }
  const node = nodes.find((node) => node.id === nodeID);
  return node;
}
