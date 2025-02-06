function withTimeout(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), timeout)
  })

  return Promise.race([promise, timeoutPromise])
}

// Example usage:
const longRunningTask = new Promise((resolve) => {
  setTimeout(() => resolve('Task completed!'), 5000)
})

withTimeout(longRunningTask, 2000)
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.error(error.message) // Output: "Operation timed out"
  })
