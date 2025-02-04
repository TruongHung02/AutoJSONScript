import * as fs from "fs";
import { config } from "../config";
import path from "path";
import { INode } from "../interface";

export default async function formatNodes(): Promise<INode[]> {
  try {
    const scriptPath = path.resolve(
      __dirname,
      `../jsonscript/${config.script}`
    );
    const jsonString = await fs.promises.readFile(scriptPath, "utf8");
    const parsedData = JSON.parse(jsonString);
    const nodes: any[] = parsedData.script.flow.nodes;

    const formattedNodes = nodes
      .filter(
        (node) => node.type !== "custom-context-menu" && node.type !== "helper"
      )
      .map((node) => ({
        id: node.id,
        action: node.data.action,
        options: node.data.options,
        successNode: node.data.successNode,
        failNode: node.data.failNode, // Fixed potential mistake
      }));
    return formattedNodes;
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}
