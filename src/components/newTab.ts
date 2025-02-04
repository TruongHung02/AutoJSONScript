import { Browser, Page } from "puppeteer";
import nextNode, { findNode } from "./nextNode";
import authProxyPage from "../helper/authProxyPage";
import { INewTabNode, INode } from "../interface";

export default async function newTab(
  nodeID: string | null,
  nodes: INode[],
  browser: Browser,
  pages: Page[],
  activePage: number,
  proxy?: string
) {
  const node = findNode(nodeID, nodes) as INewTabNode;
  try {
    const newpage = !proxy
      ? await browser.newPage()
      : await authProxyPage(await browser.newPage(), "user", "password");
    await newpage.goto(node?.options.url);
    await newpage.waitForNetworkIdle();

    pages.push(newpage);
    activePage = pages.length - 1;

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
