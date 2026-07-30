/**
 * Main-thread client for the transliteration Web Worker.
 *
 * Provides the same surface as InterscriptRuntime (transliterate,
 * loadMap) but routes calls to a background worker via postMessage.
 * Returns promises that resolve when the worker posts back.
 *
 * Spawning pattern (Vite-compatible):
 *
 *   import { createWorkerClient } from "./worker-client"
 *   const interscript = await createWorkerClient()
 *   const result = await interscript.transliterate("bgnpcgn-ukr-Cyrl-Latn-2019", "Антон")
 *
 * The worker is created lazily on first call and reused for the
 * page lifetime.
 */

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

export interface WorkerClient {
  /** Transliterate `input` using `systemCode`. Resolves off main thread. */
  transliterate(systemCode: string, input: string, stage?: string): Promise<string>
  /** Preload a system + its deps. */
  loadMap(systemCode: string): Promise<unknown>
  /** Reset the worker's runtime. */
  reset(): Promise<void>
  /** Terminate the worker (page teardown). */
  terminate(): void
}

let worker: Worker | undefined
let nextId = 1
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

function ensureWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL("./transliteration-worker.ts", import.meta.url), {
    type: "module",
  })
  worker.addEventListener("message", (event: MessageEvent<RpcResponse>) => {
    const { id, ok, result, error } = event.data
    const pair = pending.get(id)
    if (!pair) return
    pending.delete(id)
    if (ok) pair.resolve(result)
    else pair.reject(new Error(error ?? "unknown worker error"))
  })
  worker.addEventListener("error", (e) => {
    // Fail all pending on terminal error
    for (const [id, pair] of pending) {
      pending.delete(id)
      pair.reject(new Error(e.message))
    }
  })
  return worker
}

function call<T>(method: RpcRequest["method"], args?: readonly unknown[]): Promise<T> {
  const id = nextId++
  const w = ensureWorker()
  return new Promise<T>((resolve, reject) => {
    pending.set(id, {
      resolve: (v: unknown) => resolve(v as T),
      reject,
    })
    const req: RpcRequest = { id, method, args }
    w.postMessage(req)
  })
}

/**
 * Create (or reuse) the singleton transliteration worker client.
 * Safe to call repeatedly — returns the same client.
 */
export function createWorkerClient(): WorkerClient {
  return {
    transliterate: (systemCode, input, stage) =>
      call<string>("transliterate", [systemCode, input, stage]),
    loadMap: (systemCode) => call("loadMap", [systemCode]),
    reset: () => call<void>("reset"),
    terminate: () => {
      worker?.terminate()
      worker = undefined
      pending.clear()
    },
  }
}
