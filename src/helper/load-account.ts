import fs from 'fs/promises'

export default async function loadAccount() {
  const data = await fs.readFile(process.cwd() + '/accounts.txt', 'utf-8')
  const lines = data.split(/\r?\n/).filter(Boolean) // Loại bỏ dòng trống
  return lines
}
