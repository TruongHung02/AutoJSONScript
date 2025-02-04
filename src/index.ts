import path from "path";
import puppeteer from "puppeteer";
import { EXECUTABLE_PATH, USER_AGENT } from "./config";
import createBrowser from "./helper/createBrowser";

(async () => {
  //   const extensionPath = path.resolve(__dirname, "my-extension-folder");
  const browser = await createBrowser();
  const page = await browser.newPage();

  await page.goto("https://youtube.com");

  console.log(await page.title());

  await browser.close();
})();
