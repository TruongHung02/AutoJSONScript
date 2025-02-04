import path from "path";
import puppeteer, { Browser } from "puppeteer";
import { EXECUTABLE_PATH, USER_AGENT } from "../config";

export default async function createBrowser(
  proxyString?: string
): Promise<Browser> {
  const browser = await puppeteer.launch({
    executablePath: EXECUTABLE_PATH, // Adjust this path based on your system
    headless: false,
    args: [
      //   `--disable-extensions-except=${extensionPath}`,
      //   `--load-extension=${extensionPath}`,
      `--user-agent=${USER_AGENT}`,
    ],
  });

  return browser;
}
