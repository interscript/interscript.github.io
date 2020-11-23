import React, { useState } from 'react'
import { ScriptConversionExample } from "types/index"
import { ScriptConversionSystem } from "../scs"
import styled from 'styled-components'

interface ScriptConversionView extends ScriptConversionExample {
  scs?: ScriptConversionSystem
}

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
  data: ScriptConversionExample, years?: number[], setYear?: Function, selected?: number
}> = function ({ data: s, years = null, setYear=null, selected= 0 }) {
  const aggr:boolean = years && years.length > 1
  return (
    <div>
      <SampleTitle>
        <strong style={{ color: '#002060' }}>{s.lang}</strong> [{aggr ? 'BGN/PCGN ' : s.isoName}
        {
          aggr &&
          years.map((id, index) => (
              <YearNavItem href='javascript:void(0)' onClick={() => setYear(index)}
                           key={index} style={{fontWeight: index === selected ? 'bolder' : null}}
              >{id}</YearNavItem>
            )
          )
        }]
      </SampleTitle>
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

export const AggrSample: React.FC<{
  data: ScriptConversionView[]
}> = function ({ data}) {
  const [sel, setSel] = useState(0)
  const ids = data.map(e => e.year).sort((a,b) => (b - a))
  const findDataByIndex = () => data.find(e => e.year === ids[sel])

  return (
    <div>
      {
        ids.length > 1
          ? <Sample data={findDataByIndex()} years={ids} setYear={setSel} selected={sel} />
          : ids.length === 1 ? <Sample data={data[0]} /> : null
      }
    </div>
  )
}

// const YearNav = styled.nav`
//   margin-bottom: -1rem;
// `
const SampleTitle = styled.p`
  & > a:last-child {
    margin-right: 0;  
  }
`
const YearNavItem = styled.a`
  cursor: pointer;
  
  &, &:link, &:visited {
    border-bottom: none;
  }
  
  &:active, &:visited, &:hover, &:focus {
    font-weight: bolder;
  }
  margin-right: 0.25rem;  
`

export const Poster: React.FC<{
  data: ScriptConversionExample[], aggregate?: boolean
}> = function ({ data, aggregate= false }) {

  const groupByLang = () => (
    data.reduce((r: any, a: ScriptConversionExample) => {
      r[a.lang] = r[a.lang] || [];
      r[a.lang].push(a)
      return r;
    }, Object.create(null))
  )

  let left, right
  if (aggregate) {
    const result: any = groupByLang()
    const langs: string[] = Object.keys(result)
    const genSample = (lang: string, i: number) =>
        (
          <AggrSample data={result[lang]} key={i}/>
        )
    left = langs.slice(0, langs.length / 2).map(genSample)
    right = langs.slice(langs.length / 2, langs.length).map(genSample)
  } else {
    const genSample = (s: ScriptConversionExample, index: number) =>
      (
        <Sample data={s} key={index}/>
      )
    left = data.slice(0, data.length / 2).map(genSample)
    right = data.slice(data.length / 2, data.length).map(genSample)
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        { left }
      </div>
      <div style={{ flex: 1 }}>
        { right }
      </div>
    </div>
  )
}