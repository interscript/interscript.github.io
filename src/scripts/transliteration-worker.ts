/**
 * Transliteration Web Worker.
 *
 * Runs interscript-ts off the main thread. Handles transliterate,
 * loadMap, and configure RPCs from the main-thread client.
 *
 heavy: transliterating many names in parallel (Compare, Batch) would
 * jank the UI thread; moving to a worker keeps the page responsive.
 *
 * Vite bundles this automatically when the main thread spawns it via
 * `new Worker(new URL('./transliteration-worker.ts', import.meta.url), { type: 'module' })`.
 */

import { configure, reset, transliterateAsync, loadMapAsync, type LoadStrategy } from "interscript"
import { mapStrategies } from "./map-strategies"

interface RpcRequest {
  readonly id: number
  readonly method: "configure" | "transliterate" | "loadMap" | "reset"
  readonly args?: readonly unknown[]
}

interface RpcResponse {
  readonly id: number
  readonly ok: boolean
  readonly result?: unknown
  readonly error?: string
}

// Minimal view of the worker global — the DOM lib tsconfig has no
// DedicatedWorkerGlobalScope, and only these two members are used.
interface WorkerContext {
  addEventListener(type: "message", listener: (event: MessageEvent<RpcRequest>) => void): void
  postMessage(message: RpcResponse): void
}

const ctx = self as unknown as WorkerContext

let configured = false

function defaultStrategies(): LoadStrategy[] {
  return mapStrategies()
}

function ensureConfigured() {
  if (configured) return
  reset()
  configure({ strategies: defaultStrategies() })
  configured = true
}

ctx.addEventListener("message", async (event: MessageEvent<RpcRequest>) => {
  const { id, method, args = [] } = event.data
  try {
    let result: unknown
    if (method === "configure") {
      reset()
      configure({
        strategies: (args[0] as LoadStrategy[] | undefined) ?? defaultStrategies(),
      })
      configured = true
      result = undefined
    } else if (method === "reset") {
      reset()
      configured = false
      result = undefined
    } else if (method === "transliterate") {
      ensureConfigured()
      const [systemCode, input, stage] = args as [string, string, string?]
      result = await transliterateAsync(systemCode, input, stage)
    } else if (method === "loadMap") {
      ensureConfigured()
      const [systemCode] = args as [string]
      result = await loadMapAsync(systemCode)
    } else {
      throw new Error(`Unknown method: ${method}`)
    }
    const response: RpcResponse = { id, ok: true, result }
    ctx.postMessage(response)
  } catch (e) {
    const response: RpcResponse = {
      id,
      ok: false,
      error: (e as Error).message,
    }
    ctx.postMessage(response)
  }
})
