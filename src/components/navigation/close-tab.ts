import { Browser, Page } from "puppeteer";
import nextNode, { findNode } from "../next-node";
import {
  IActivateTabNode,
  ICloseTabNode,
  INewTabNode,
  INode,
} from "../../interface";

export default async function closeTab(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string
) {
  const node = findNode(nodeID, nodes) as ICloseTabNode;
  try {
    if (node.options.closeType === "current") {
      await pages[activePage].close();
    } else {
      await pages[node.options.tabNumber].close();
    }

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
