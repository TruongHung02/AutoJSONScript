import * as fs from 'fs'
import { config } from '../config'
import path from 'path'
import { INode } from '../interface'
import { logger } from './logger'

export default async function formatNodes(): Promise<INode[]> {
  try {
    const scriptPath = path.resolve(__dirname, `../jsonscript`)
    const jsonString = await fs.promises.readFile(`${scriptPath}/${config.script}`, 'utf8')
    const parsedData = JSON.parse(jsonString)
    const nodes: any[] = parsedData.script.flow.nodes

    const formattedNodes = nodes
      .filter((node) => node.type !== 'custom-context-menu' && node.type !== 'helper')
      .map((node) => ({
        id: node.id,
        action: node.data.action,
        options: node.data.options,
        successNode: node.data.successNode,
        failNode: node.data.failNode, // Fixed potential mistake
      }))

    await fs.promises.writeFile(scriptPath + '/nodes.json', JSON.stringify(formattedNodes, null, 2), 'utf8')
    return formattedNodes
  } catch (error) {
    logger.error('Error reading file')
    return []
  }
}
