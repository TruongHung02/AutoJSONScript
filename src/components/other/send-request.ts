import nextNode, { findNode } from '../next-node'
import { ActionParams, IHttpRequestNode } from '../../interface'
import { logger } from '../../helper/logger'
import { delay } from '~/until'
import { config } from '~/config'
import axiosInstance from '~/helper/axiosInstance'

export default async function sendRequest(actionParams: ActionParams) {
  const { nodeID, nodes, browser, pages, activePage, proxy, variables } = actionParams
  const node = findNode(nodeID, nodes) as IHttpRequestNode
  const page = pages[activePage] // Tối ưu truy cập
  try {
    await delay(Number(node.options.nodeSleep))

    const url = node.options.url
    const method = node.options.method
    const body = {
      secretKey: 'Nodeverse-report-tool',
      type: 'GRADIENT',
      email: actionParams.customVariables?.account,
      point: variables[variables.findIndex((variable) => variable.name === 'today_reward')].value,
      device: 'GRADIENT REPORT',
      ip: {
        proxy: proxy,
        status: 'CONNECTED',
        point: variables[variables.findIndex((variable) => variable.name === 'today_reward')].value,
      },
    }
    // const headers: Record<string, string> = {}
    // node.options.headers.forEach((header: { name: string; value: string }) => {
    //   headers[header.name] = header.value
    // })

    // console.log(headers)
    const methodMap = {
      GET: () => axiosInstance.get(url),
      POST: () => axiosInstance.post(url, body),
      PUT: () => axiosInstance.put(url, body),
    }

    const request = methodMap[method]
    const response = await request()
    console.log(response.data)

    if (config.screenshot) {
      await pages[activePage].screenshot({ path: 'screenshot.png' })
    }

    if (node?.successNode) {
      actionParams.nodeID = node?.successNode
      await nextNode(actionParams)
    }
  } catch (error) {
    logger.error(`Account: ${actionParams.customVariables?.account} ${error}`)
    if (node?.failNode) {
      actionParams.nodeID = node?.failNode
      await nextNode(actionParams)
    }
  }
}
