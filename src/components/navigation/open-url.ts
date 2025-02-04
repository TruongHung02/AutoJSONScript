import { Browser, Page } from "puppeteer";
import nextNode, { findNode } from "../next-node";
import { INode, IOpenUrlNode } from "../../interface";

export default async function openUrl(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string
) {
  const node = findNode(nodeID, nodes) as IOpenUrlNode;
  try {
    await pages[activePage].goto(node.options.url);

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
