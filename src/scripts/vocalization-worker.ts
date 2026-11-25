/**
 * Vocalization Web Worker.
 *
 * Runs the neural vocalization models (plane + imf-v1 kinds) off the
 * main thread via onnxruntime-web: model fetch + index sha256
 * verification + Cache API persistence + session creation + decode all
 * happen here; the main thread receives progress events and the final
 * text (plus decode stats for the seq2seq kind).
 *
 * WASM only, single-threaded, deliberately: the conformance contract is
 * byte-exact, and GPU execution providers vary per device, so a webgpu
 * flip can silently change a vocalized character. The loaded session
 * per model id is reused across requests.
 */

import { imf, PlaneModel } from "interscript/ml"
import * as ort from "onnxruntime-web"

// The bundled ort-web variant (Vite picks dist/ort.bundle.min.mjs)
// embeds the JSEP emscripten glue and fetches its matching binary by
// name; a hashed Vite asset URL must be registered for exactly that
// binary — the plain binary does not export the JSEP glue's function
// table (wasm call-table crash). Single thread: no COOP/COEP on the
// static site, and single-thread decode is the conformance path.
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.jsep.wasm?url"

ort.env.wasm.wasmPaths = { wasm: wasmUrl }
ort.env.wasm.numThreads = 1
ort.env.wasm.simd = true

type ModelKind = "plane" | "imf"

interface LoadedModel {
  readonly kind: ModelKind
  readonly model: {
    transform?(text: string): Promise<string>
    translate?(text: string, maxLen?: number, opts?: object): Promise<string>
    dispose?(): Promise<void>
  }
}

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
  /** In-band progress (load only): a response without result/error. */
  readonly progress?: { fraction: number; bytes: number }
}

// Minimal view of the worker global — the DOM lib tsconfig has no
// DedicatedWorkerGlobalScope, and only these two members are used.
interface WorkerContext {
  addEventListener(type: "message", listener: (event: MessageEvent<RpcRequest>) => void): void
  postMessage(message: RpcResponse): void
}

const ctx = self as unknown as WorkerContext

const loaded = new Map<string, LoadedModel>()

async function ensureLoaded(
  modelId: string,
  kind: ModelKind,
  onProgress: (progress: { fraction: number; bytes: number }) => void,
): Promise<LoadedModel> {
  const hit = loaded.get(modelId)
  if (hit) return hit
  const resolved = await imf.resolve(modelId, undefined, {
    onProgress: (fraction, bytes) => onProgress({ fraction, bytes }),
  })
  // fromZip/fromZipBytes default to webgpu:false (wasm-only) — GPU
  // rounding varies per device, so the frozen conformance vectors are
  // only guaranteed on the CPU path.
  const model: LoadedModel["model"] =
    kind === "plane"
      ? await PlaneModel.fromZip(resolved.bytes)
      : await imf.IMFModel.fromZipBytes(resolved.bytes)
  const entry: LoadedModel = { kind, model }
  loaded.set(modelId, entry)
  return entry
}

ctx.addEventListener("message", async (event: MessageEvent<RpcRequest>) => {
  const { id, method, args = [] } = event.data
  try {
    let result: unknown
    if (method === "load") {
      const [modelId, kind] = args as [string, ModelKind]
      const entry = await ensureLoaded(modelId, kind, (progress) => {
        ctx.postMessage({ id, ok: true, progress })
      })
      result =
        entry.kind === "plane"
          ? { kind: entry.kind, kPasses: (entry.model as PlaneModel).kPasses }
          : { kind: entry.kind }
    } else if (method === "transform") {
      const [modelId, kind, text] = args as [string, ModelKind, string]
      const entry = await ensureLoaded(modelId, kind, () => {})
      const t0 = Date.now()
      if (entry.kind === "plane") {
        result = { output: await entry.model.transform!(text), ms: Date.now() - t0 }
      } else {
        const gaps: number[] = []
        const output = await entry.model.translate!(text, 256, {
          onConfidence: (gap: number) => gaps.push(gap),
        })
        result = {
          output,
          ms: Date.now() - t0,
          minGap: gaps.length ? Math.min(...gaps) : undefined,
        }
      }
    } else if (method === "dispose") {
      const [modelId] = args as [string]
      const entry = loaded.get(modelId)
      if (entry) {
        await entry.model.dispose?.()
        loaded.delete(modelId)
      }
      result = undefined
    } else {
      throw new Error(`Unknown method: ${method}`)
    }
    ctx.postMessage({ id, ok: true, result })
  } catch (e) {
    const cause = (e as Error).cause as Error | undefined
    ctx.postMessage({
      id,
      ok: false,
      error: (e as Error).message + (cause ? ` — ${cause.message}` : ""),
    })
  }
})
