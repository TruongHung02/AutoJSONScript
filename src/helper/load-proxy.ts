import fs from 'fs/promises'

export async function readFileLines(filePath: string) {
  const data = await fs.readFile(filePath, 'utf-8')
  const lines = data.split(/\r?\n/) // Hỗ trợ cả Windows (\r\n) và Linux (\n)

  for (const line of lines) {
    console.log(`Dòng: ${line}`)
  }
}

export default async function loadProxies() {
  const data = await fs.readFile(process.cwd() + '/proxies.txt', 'utf-8')
  const lines = data.split(/\r?\n/).filter(Boolean) // Loại bỏ dòng trống
  return lines
}
