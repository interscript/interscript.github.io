/**
 * Main-thread client for the vocalization Web Worker.
 *
 * Same shape as the transliteration worker client: typed RPC over
 * postMessage, worker spawned lazily via `new Worker(new URL(...),
 * { type: "module" })` (Vite bundles it), reused for the page
 * lifetime. Load progress arrives as in-band responses carrying
 * `progress` — the pending promise only settles on the final
 * `result`/`error`.
 */

type ModelKind = "plane" | "imf"

interface RpcRequest {
  readonly id: number
  readonly method: "load" | "transform" | "dispose"
  readonly args?: readonly unknown[]
}

interface RpcResponse {
  readonly id: number
  readonly ok: boolean
  readonly result?: unknown
  readonly error?: string
  readonly progress?: { fraction: number; bytes: number }
}

export interface TransformStats {
  /** Vocalized text. */
  readonly output: string
  /** Decode wall time in the worker, ms. */
  readonly ms: number
  /** seq2seq only: minimum top1–top2 logit gap across decode steps. */
  readonly minGap?: number
}

export interface LoadInfo {
  readonly kind: ModelKind
  readonly kPasses?: number
}

export interface VocalizationClient {
  /** Fetch (once, Cache-API-backed), verify, and open a session. */
  load(
    modelId: string,
    kind: ModelKind,
    onProgress?: (fraction: number, bytes: number) => void,
  ): Promise<LoadInfo>
  /** Vocalize text with a loaded model. */
  transform(modelId: string, kind: ModelKind, text: string): Promise<TransformStats>
  /** Release a model's session in the worker. */
  dispose(modelId: string): Promise<void>
  /** Terminate the worker (page teardown). */
  terminate(): void
}

let worker: Worker | undefined
let nextId = 1
const pending = new Map<
  number,
  {
    resolve: (v: unknown) => void
    reject: (e: Error) => void
    onProgress?: (fraction: number, bytes: number) => void
  }
>()

function ensureWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL("./vocalization-worker.ts", import.meta.url), {
    type: "module",
  })
  worker.addEventListener("message", (event: MessageEvent<RpcResponse>) => {
    const { id, ok, result, error, progress } = event.data
    const pair = pending.get(id)
    if (!pair) return
    if (progress) {
      pair.onProgress?.(progress.fraction, progress.bytes)
      return // interim message: the request is still in flight
    }
    pending.delete(id)
    if (ok) pair.resolve(result)
    else pair.reject(new Error(error ?? "unknown worker error"))
  })
  worker.addEventListener("error", (e) => {
    for (const [id, pair] of pending) {
      pending.delete(id)
      pair.reject(new Error(e.message))
    }
  })
  return worker
}

function call<T>(
  method: RpcRequest["method"],
  args?: readonly unknown[],
  onProgress?: (fraction: number, bytes: number) => void,
): Promise<T> {
  const id = nextId++
  const w = ensureWorker()
  return new Promise<T>((resolve, reject) => {
    pending.set(id, { resolve: (v) => resolve(v as T), reject, onProgress })
    const req: RpcRequest = { id, method, args }
    w.postMessage(req)
  })
}

export function createVocalizationClient(): VocalizationClient {
  return {
    load: (modelId, kind, onProgress) => call<LoadInfo>("load", [modelId, kind], onProgress),
    transform: (modelId, kind, text) => call<TransformStats>("transform", [modelId, kind, text]),
    dispose: (modelId) => call<void>("dispose", [modelId]),
    terminate: () => {
      worker?.terminate()
      worker = undefined
      pending.clear()
    },
  }
}
