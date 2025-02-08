import { ElementHandle, Page } from 'puppeteer'
import { Proxy } from './interface'

export function delay(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export function timeoutPromise(ms: number = 30000): Promise<void> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), ms)
  })
}

export function waitForXpathSelector(page: Page, xpathSelector: string, timeout: number = 30) {
  const timeoutPromise = new Promise<ElementHandle<Element> | null>((_, reject) =>
    setTimeout(() => reject(new Error(`Cant find element with Xpath selector: ${xpathSelector}`)), timeout * 1000),
  )
  return Promise.race([page.waitForSelector(xpathSelector), timeoutPromise])
}

export async function fetchWithTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout exceeded')), timeout))

  return Promise.race([fn(), timeoutPromise])
}

export function formatProxy(proxy: string): Proxy {
  const [credentials, hostPort] = proxy.split('@')
  const [user, password] = credentials.split(':')
  const [host, port] = hostPort.split(':')

  return { user, password, host, port }
}
