import { ElementHandle } from 'puppeteer'
import nextNode, { findNode } from '../next-node'
import { ActionParams, IScrollNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay, waitForXpathSelector } from '~/until'
import { SELECTOR_TYPE } from '~/const'
import { config } from '~/config'

export default async function scroll(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy } = actionParams
  const node = findNode(nodeID, nodes) as IScrollNode
  try {
    await delay(Number(node.options.nodeSleep))

    if (node.options.scrollBy === 'selector') {
      let scrollElement: ElementHandle<Element> | null = null

      if (node.options.selectorType === SELECTOR_TYPE.XPATH) {
        scrollElement = await waitForXpathSelector(pages[activePage], `::-p-xpath(${node.options.selector})`)
      } else if (node.options.selectorType === SELECTOR_TYPE.CSS) {
        scrollElement = await pages[activePage].waitForSelector(node.options.selector)
      } else {
        throw new Error('Click failed. Please select element by CSS selector or Xpath selector')
      }

      if (scrollElement) {
        await scrollElement.scrollIntoView()
      }
    } else if (node.options.scrollBy === 'coordinates') {
      try {
        await pages[activePage].evaluate(
          async (x, y, direction) => {
            const scrollStep = direction === 'Down' ? 100 : -100
            const delay = 25 // Giảm thời gian chờ để mượt hơn
            const steps = Math.ceil(y / Math.abs(scrollStep))

            for (let i = 0; i < steps; i++) {
              window.scrollBy(0, scrollStep)
              await new Promise((resolve) => setTimeout(resolve, delay))
            }
          },
          Number(node.options.x),
          Number(node.options.y),
          node.options.scrollDirection,
        )
      } catch (error) {
        console.error('Lỗi khi cuộn trang:', error)
      }
    }

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }

    if (node?.successNode) {
      actionParams.nodeID = node?.successNode
      await nextNode(actionParams)
    }
  } catch (error) {
    logger.error(error as string)
    if (node?.failNode) {
      actionParams.nodeID = node?.failNode
      await nextNode(actionParams)
    }
  }
}
