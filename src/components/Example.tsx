import React, { useState } from 'react'
import { ScriptConversionExample } from "types/index"
import { ScriptConversionSystem, systemFromCode } from "../scs"
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
  data: ScriptConversionExample, years?: string[], setYear?: Function
}> = function ({ data: s, years = null, setYear=null }) {
  return (
    <div>
      <p>
        <strong style={{ color: '#002060' }}>{s.lang}</strong> [{s.isoName + ' '}
        {
          years && years.length > 0 &&
          years.map((id, index) => (
              <YearNavItem onClick={() => setYear(index)}
                           key={index}
              >{id} </YearNavItem>
            )
          )
        }]
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

export const AggrSample: React.FC<{
  data: ScriptConversionView[]
}> = function ({ data}) {
  const [sel, setSel] = useState(0)
  const ids = data.map(e => e.scs?.id).sort((a,b) => (parseInt(b)- parseInt(a)))

  const findDataByIndex = () => data.find(e => e.scs?.id === ids[sel])
  console.log(sel)
  return (
    <div>
      <Sample data={findDataByIndex()} years={ids} setYear={setSel}/>
    </div>
  )
}

// const YearNav = styled.nav`
//   margin-bottom: -1rem;
// `

const YearNavItem = styled.a`
  cursor: pointer;
  
  &, &:link, &:visited {
    border-bottom: none;
  }
  
  &:active, &:visited, &:hover, &:focus {
    font-weight: bolder;
  }
  margin-right: 0.25rem;
  border-bottom: none !important;
`


export const Poster: React.FC<{
  data: ScriptConversionExample[]
}> = function ({ data }) {

  const groupByLang = () => (
    data.reduce((r: any, e: ScriptConversionExample) => {
      const a: ScriptConversionView = {...e}

      if (!!e.systemName) {
        a.scs = systemFromCode(e.systemName)
      }
      r[a.lang] = r[a.lang] || [];
      r[a.lang].push(a)
      return r;
    }, Object.create(null))
  )
  const result: any = groupByLang()
  console.log(result)
  const langs: string[] = Object.keys(result)
  const genSample = (lang: string, i: number) => {
    if (result[lang].length === 1) {
      return (
        <Sample data={result[lang][0]} key={i}/>
      )
    } else {
      return (
        <AggrSample data={result[lang]} key={i}/>
      )
    }
  }
  const left = langs.slice(0, langs.length / 2).map(genSample)
  const right = langs.slice(langs.length / 2, langs.length).map(genSample)
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