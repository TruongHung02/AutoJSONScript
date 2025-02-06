import { Page } from 'puppeteer'
import createBrowser from './helper/create-browser'
import { delay } from './until'
import formatNodes from './helper/format-nodes'
import nextNode from './components/next-node'

// (async () => {
//   //   const extensionPath = path.resolve(__dirname, "my-extension-folder");
//   // const browser = await createBrowser("user:1735970485@157.66.252.255:41235");
//   const browser = await createBrowser();

//   await newTab(browser, "https://youtube.com");

//   await browser.close();
// })();
;(async () => {
  const nodes = await formatNodes()
  const pages: Page[] = []
  const activePage: number = 0

  const browser = await createBrowser()

  await nextNode(nodes[0].successNode, nodes, browser, pages, activePage)

  await delay(2000)
  // await browser.close()

  // // Đóng trình duyệt sau 5 giây
  // setTimeout(async () => {
  //   await browser.close();
  // }, 5000);
})()
