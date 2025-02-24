import * as fs from 'fs'
import path from 'path'
import { INode, IVar } from '../interface'
import { logger } from './logger'

export default async function formatNodes(script: string): Promise<{
  formattedNodes: INode[]
  formattedVariables: IVar[]
} | null> {
  try {
    const scriptPath = path.resolve(__dirname, '../../jsonscript')
    const jsonFilePath = path.join(scriptPath, script)
    const jsonString = await fs.promises.readFile(jsonFilePath, 'utf8')
    const parsedData = JSON.parse(jsonString)

    const nodes: any[] = parsedData.script.flow.nodes ?? []
    const variables: any[] = parsedData.script.variables ?? []

    const formattedNodes = nodes
      .filter(({ type }) => type !== 'custom-context-menu' && type !== 'helper')
      .map(({ id, data }) => ({
        id,
        action: data.action,
        options: data.options,
        successNode: data.successNode ?? null,
        failNode: data.failNode ?? null,
        startLoopNode: data.startLoopNode ?? null,
      }))

    const formattedVariables = variables.map(({ name, value }) => ({ name, value }))

    await fs.promises.writeFile(path.join(scriptPath, 'nodes.json'), JSON.stringify(formattedNodes, null, 2), 'utf8')
    await fs.promises.writeFile(
      path.join(scriptPath, 'variables.json'),
      JSON.stringify(formattedVariables, null, 2),
      'utf8',
    )

    return { formattedNodes, formattedVariables }
  } catch (error) {
    logger.error(error as string)
    return null
  }
}
