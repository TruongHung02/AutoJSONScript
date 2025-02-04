import path from "path";
import puppeteer, { Page } from "puppeteer";
import { config } from "./config";
import createBrowser from "./helper/create-browser";
import { delay } from "./until";
import authProxyPage from "./helper/auth-proxy-page";
import newTab from "./components/navigation/new-tab";
import formatNodes from "./helper/format-nodes";
import nextNode from "./components/next-node";

// (async () => {
//   //   const extensionPath = path.resolve(__dirname, "my-extension-folder");
//   // const browser = await createBrowser("user:1735970485@157.66.252.255:41235");
//   const browser = await createBrowser();

//   await newTab(browser, "https://youtube.com");

//   await browser.close();
// })();

(async () => {
  const nodes = await formatNodes();
  const pages: Page[] = [];
  let activePage: number = 0;

  const browser = await createBrowser();

  await nextNode(nodes[0].successNode, nodes, browser, pages, activePage);

  await delay(2000);
  await browser.close();

  // // Đóng trình duyệt sau 5 giây
  // setTimeout(async () => {
  //   await browser.close();
  // }, 5000);
})();
