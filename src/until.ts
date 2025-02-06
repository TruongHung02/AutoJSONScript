export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function timeoutPromise(ms: number = 30000): Promise<void> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), ms)
  })
}
