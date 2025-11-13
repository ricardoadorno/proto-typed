import * as assert from 'assert'

/**
 * Waits for a condition to be true within a given timeout.
 * @param condition The function that returns true when the condition is met.
 * @param timeout The maximum time to wait in milliseconds.
 * @param interval The interval to check the condition in milliseconds.
 * @param message An optional message to display if the timeout is reached.
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number,
  interval: number = 100,
  message: string = 'Condition not met within timeout'
): Promise<void> {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
  assert.fail(message)
}
