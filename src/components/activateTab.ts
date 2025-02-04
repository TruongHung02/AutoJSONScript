import { Browser, Page } from "puppeteer";
import nextNode, { findNode } from "./nextNode";
import authProxyPage from "../helper/authProxyPage";
import { IActivateTabNode, INewTabNode, INode } from "../interface";

export default async function activateTab(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string
) {
  const node = findNode(nodeID, nodes) as IActivateTabNode;
  try {
    await pages[node.options.tabNumber].bringToFront();
    if (node?.successNode) {
      proxy
        ? await nextNode(node?.successNode, nodes, browser, pages, activePage)
        : await nextNode(
            node?.successNode,
            nodes,
            browser,
            pages,
            activePage,
            proxy
          );
    }
  } catch (error) {
    if (node?.failNode) {
      proxy
        ? await nextNode(node?.failNode, nodes, browser, pages, activePage)
        : await nextNode(
            node?.failNode,
            nodes,
            browser,
            pages,
            activePage,
            proxy
          );
    }
  }
}
