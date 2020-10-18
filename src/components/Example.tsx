import React from 'react'
import { ScriptConversionExample } from "types/index";

export const English: React.FC<{
  samples: any
}> = function ({ samples }) {
  return (
    <>
      { !!samples && <span> [<i>{samples}</i>]</span>}
    </>
  )
}

export const Sample: React.FC<{
  data: ScriptConversionExample
}> = function ({ data: s }) {
  return (
    <div>
      <p>
        <strong style={{ color: '#002060' }}>{s.lang}</strong> [{s.isoName}]
      </p>
      <p>
        {s.samples.map((e: string, i: number) => (
          <span key={i}>
            { `${e} ${s.result[i] ? s.result[i] : ''}`}
            { s.english && !!s.english[i] && <English samples={s.english[i]} />}
            { i + 1 < s.samples.length && ', '}
          </span>
        ))
        }
        <i>{(s.result.length > 0) ? '' : ' (To be implemented)'}</i>
      </p>
    </div>
  )
}

export const Poster: React.FC<{
  data: ScriptConversionExample[]
}> = function ({ data }) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {data.slice(0, data.length / 2).map((s: ScriptConversionExample, i: number) => (
          <Sample data={s} key={i} />
        ))
        }
      </div>
      <div style={{ flex: 1 }}>
        {data.slice(data.length / 2, data.length).map((s: ScriptConversionExample, i: number) => (
          <Sample data={s} key={i} />
        ))
        }
      </div>
    </div>
  )
}