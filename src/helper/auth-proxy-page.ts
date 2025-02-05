import { Page } from 'puppeteer'

export default async function authProxyPage(page: Page, username: string, password: string): Promise<Page> {
  await page.authenticate({
    username: username,
    password: password,
  })
  return page
}
