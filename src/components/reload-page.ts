import { Browser, Page } from "puppeteer";
import nextNode, { findNode } from "./next-node";
import { INode, IOpenUrlNode, IReloadPageNode } from "../interface";

export default async function reloadPage(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string
) {
  const node = findNode(nodeID, nodes) as IReloadPageNode;
  try {
    await pages[activePage].reload();

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
