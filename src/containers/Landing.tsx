import React, { useState, useEffect/*, useRef*/ } from 'react'
// import { useRouteData } from 'react-static'
import axios, { AxiosResponse } from 'axios'
import styled from 'styled-components'
import samples from './samples.json'

export default () => {
  // const { foo } = useRouteData();

  const [sampleData, setSampleData] = useState([])

  useEffect(() => {
    (async () => {
      const Opal = (window as any).Opal as any
      const data = await Promise.all(samples.map(async(s) => {
        const text = s.samples.join(',')
        const { systemName: system } = s
        if (!text || !system) return s
        try {
          const resp: AxiosResponse<any> = await axios.get(`/maps/${system}.json`)
          const { data: json } = resp
          Opal.Interscript.$load_map_json(system, JSON.stringify(json))
          const result = Opal.Interscript.$transliterate(system, text).split(',');
          return {...s, result }
        } catch (e) {
          console.log(e)
        }
        return s;
      }))
      setSampleData(data)
    })()
  }, [])

  return (
    <>
<SectionGrid>
        <Section
            key={'ex'}
            id={'example'}
        >
          <h2>{ `Romanization examples`}</h2>
          <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i></p>
                <div style={{display: 'flex'}}>
                  <div style={{flex: 1}}>
                    { sampleData.slice(0, sampleData.length/2).map(s => (
                        <div>
                        <p> <strong style={{color: '#002060'}}>{s.lang}</strong> [{s.isoName}]
                        </p>
                        <p>
                          { s.samples.map((e: any, i: number) => (
                              <span>{ `${e} ${s.result[i] ? s.result[i] : ''} ` }</span>
                          ))
                          }
                          <i>{s.systemName ? '' : ' (To be implemented)'}</i>
                        </p>
                        </div>
                      ))
                    }
                  </div>
                  <div style={{flex: 1}}>
                    { sampleData.slice(sampleData.length/2, sampleData.length).map(s => (
                        <div>
                          <p> <strong style={{color: '#002060'}}>{s.lang}</strong> [{s.isoName}]
                          </p>
                          <p>
                            { s.samples.map((e: any, i: number) => (
                                <span>{ `${e} ${s.result[i] ? s.result[i] : ''} ` }</span>
                            ))
                            }
                            <i>{s.systemName ? '' : ' (To be implemented)'}</i>
                          </p>
                        </div>
                      ))
                    }
                </div>
              </div>
        </Section>
      </SectionGrid>
    </>
  )
}


// const SectionNav = styled.nav`
//   margin: 2rem 2rem 1rem 2rem;
//   text-align: center;
//
//   @media screen and (min-width: 900px) {
//     text-align: unset;
//     margin: 2rem 0 1rem 1rem;
//   }
// `
//
//
// const SectionNavItem = styled.a`
//   display: inline-block;
//   margin-right: 1em;
//
//   white-space: nowrap;
//
//   &, &:link, &:visited {
//     border-bottom: none;
//   }
//
//   @media screen and (min-width: 900px) {
//     &::before {
//       content: "•";
//       display: inline;
//       margin: 0 1em 0 0;
//     }
//   }
// `

const Section = styled.article`
  a.anchor {
    margin-right: .5rem;

    &, &:link, &:visited {
      border: none;
    }
  }
  a[rel*=noopener] {
    &, &:link, &:visited {
      border: none;
    }
  }
`


const SectionGrid = styled.div`
  overflow: hidden;
  padding: 0 1rem;

  pre, code {
    font-size: 14px;
    background: whiteSmoke;
    font-family:
      'Iosevka Term SS01', 'Iosevka Term', Iosevka,
      system-ui-monospaced,
      Menlo, 'Courier New', monospace;
  }

  pre {
    overflow-x: auto;
    padding: .75rem 1rem;
    margin: 0 -1rem;
  }

  code {
    padding: .1em .5em;
  }

  @media screen and (min-width: 900px) {
    pre {
      margin: 0;
    }
  }
`
