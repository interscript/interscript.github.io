/**
 * OpenAPI 3.1 specification for the Interscript REST API.
 *
 * Served at /openapi.json. Consumed by /api-docs (interactive reference)
 * and by anyone pointing a Swagger UI / Postman / Stoplight client at
 * the API.
 *
 * Keep this in sync with src/pages/api/*.ts. The endpoint paths here
 * match the actual routes exactly.
 */

import type { APIRoute } from "astro"

export const prerender = true

const SITE = "https://interscript.org"

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Interscript REST API",
    version: "1.0.0",
    description:
      "Authority-backed transliteration as a service. Open source, BSD-2-Clause. Maintained by Ribose Inc. with support from the U.S. National Geospatial-Intelligence Agency.",
    contact: {
      name: "Interscript",
      url: "https://interscript.org",
      email: "open.source@ribose.com",
    },
    license: {
      name: "BSD-2-Clause",
      url: "https://opensource.org/license/bsd-2-clause",
    },
  },
  servers: [{ url: `${SITE}/api` }],
  tags: [
    { name: "transliterate", description: "Run a transliteration system" },
    { name: "systems", description: "Browse the system catalogue" },
    { name: "detect", description: "Find a matching system" },
  ],
  paths: {
    "/transliterate": {
      get: {
        tags: ["transliterate"],
        summary: "Transliterate a single string",
        description:
          "Translates non-Latin text into Latin (or another script) using the named authority system. Idempotent, cacheable for the lifetime of a system version.",
        operationId: "transliterateGet",
        parameters: [
          {
            name: "system",
            in: "query",
            required: true,
            description: "Interscript system code (e.g. `bgnpcgn-ukr-Cyrl-Latn-2019`).",
            schema: { type: "string", maxLength: 200 },
            example: "bgnpcgn-ukr-Cyrl-Latn-2019",
          },
          {
            name: "input",
            in: "query",
            required: true,
            description: "Source text to transliterate.",
            schema: { type: "string", maxLength: 10_000 },
            example: "Антон",
          },
          {
            name: "stage",
            in: "query",
            required: false,
            description: "Stage to execute (default: `main`).",
            schema: { type: "string", default: "main" },
          },
        ],
        responses: {
          "200": {
            description: "Successful transliteration.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransliterationResult" },
              },
            },
          },
          "400": {
            description: "Missing or invalid parameters.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "System not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["transliterate"],
        summary: "Transliterate via JSON body",
        description:
          "Same as GET /transliterate but accepts a JSON body — useful when input is large, contains newlines, or you prefer POST semantics.",
        operationId: "transliteratePost",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TransliterationRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful transliteration.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransliterationResult" },
              },
            },
          },
          "400": {
            description: "Missing or invalid body.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      options: {
        tags: ["transliterate"],
        summary: "CORS preflight",
        description: "Returns 204 with CORS headers.",
        operationId: "transliterateOptions",
        responses: { "204": { description: "No content" } },
      },
    },
    "/transliterate/batch": {
      post: {
        tags: ["transliterate"],
        summary: "Transliterate many strings in one request",
        description:
          "Accepts an array of up to 1000 transliteration requests and returns an array of results. Each item is independent — one failure doesn't fail the batch. Designed for high-volume pipelines.",
        operationId: "transliterateBatch",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BatchRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Batch processed (individual items may have errors).",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BatchResponse" },
              },
            },
          },
          "400": {
            description: "Malformed body.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "413": {
            description: "Too many items (>1000).",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      options: {
        tags: ["transliterate"],
        summary: "CORS preflight",
        operationId: "transliterateBatchOptions",
        responses: { "204": { description: "No content" } },
      },
    },
    "/systems": {
      get: {
        tags: ["systems"],
        summary: "List transliteration systems",
        description:
          "Returns every system in the catalogue, optionally filtered by authority or script.",
        operationId: "listSystems",
        parameters: [
          {
            name: "authority",
            in: "query",
            required: false,
            description: "Authority slug (e.g. `bgnpcgn`, `iso`, `alalc`).",
            schema: { type: "string" },
            example: "bgnpcgn",
          },
          {
            name: "source_script",
            in: "query",
            required: false,
            description: "ISO 15924 source script code (e.g. `Cyrl`, `Arab`).",
            schema: { type: "string" },
            example: "Cyrl",
          },
          {
            name: "destination_script",
            in: "query",
            required: false,
            description: "ISO 15924 destination script code.",
            schema: { type: "string" },
            example: "Latn",
          },
        ],
        responses: {
          "200": {
            description: "Catalogue listing.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SystemList" },
              },
            },
          },
        },
      },
    },
    "/detect": {
      get: {
        tags: ["detect"],
        summary: "Detect candidate systems for an input/output pair",
        description:
          "Given a source-script input and an observed romanization, returns the candidate systems in the relevant script family.",
        operationId: "detectCandidates",
        parameters: [
          {
            name: "input",
            in: "query",
            required: true,
            description: "Source text.",
            schema: { type: "string" },
          },
          {
            name: "output",
            in: "query",
            required: true,
            description: "Observed romanization.",
            schema: { type: "string" },
          },
          {
            name: "source_script",
            in: "query",
            required: false,
            description: "ISO 15924 code to narrow the candidate set.",
            schema: { type: "string" },
            example: "Cyrl",
          },
        ],
        responses: {
          "200": {
            description: "Candidate systems.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DetectionResult" },
              },
            },
          },
          "400": {
            description: "Missing required parameters.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      TransliterationRequest: {
        type: "object",
        required: ["system", "input"],
        properties: {
          system: { type: "string", maxLength: 200 },
          input: { type: "string", maxLength: 10_000 },
          stage: { type: "string", default: "main" },
        },
      },
      TransliterationResult: {
        type: "object",
        required: ["system", "input", "output", "stage", "durationMs"],
        properties: {
          system: { type: "string" },
          input: { type: "string" },
          output: { type: "string" },
          stage: { type: "string" },
          durationMs: { type: "number", description: "Server processing time in milliseconds." },
        },
      },
      BatchRequest: {
        type: "object",
        required: ["items"],
        properties: {
          items: {
            type: "array",
            maxItems: 1000,
            items: { $ref: "#/components/schemas/TransliterationRequest" },
          },
        },
      },
      BatchResponse: {
        type: "object",
        required: ["results"],
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              required: ["system", "input", "durationMs"],
              properties: {
                system: { type: "string" },
                input: { type: "string" },
                output: { type: "string" },
                error: { type: "string" },
                durationMs: { type: "number" },
              },
            },
          },
        },
      },
      System: {
        type: "object",
        required: ["code", "authority", "source_script", "destination_script", "name", "year"],
        properties: {
          code: { type: "string", example: "bgnpcgn-ukr-Cyrl-Latn-2019" },
          authority: { type: "string", example: "bgnpcgn" },
          source_script: { type: "string", example: "Cyrl" },
          destination_script: { type: "string", example: "Latn" },
          name: { type: "string", example: "Romanization of Ukrainian (2019)" },
          year: { type: "string", example: "2019" },
        },
      },
      SystemList: {
        type: "object",
        required: ["count", "systems"],
        properties: {
          count: { type: "number" },
          systems: {
            type: "array",
            items: { $ref: "#/components/schemas/System" },
          },
        },
      },
      DetectionResult: {
        type: "object",
        properties: {
          input: { type: "string" },
          output: { type: "string" },
          source_script: { type: "string" },
          candidate_count: { type: "number" },
          candidates: {
            type: "array",
            items: {
              type: "object",
              properties: { code: { type: "string" } },
            },
          },
        },
      },
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string" },
          system: { type: "string" },
          durationMs: { type: "number" },
        },
      },
    },
  },
}

export const GET: APIRoute = () =>
  new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  })
