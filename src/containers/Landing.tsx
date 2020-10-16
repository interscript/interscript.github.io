import React, { useState, useEffect/*, useRef*/ } from 'react'
import { useRouteData } from 'react-static'
import { ReadmeSection, RepoInfo } from 'types'
import axios, { AxiosResponse } from 'axios'
import styled from 'styled-components'
import Loader from 'react-loader-spinner'

import samples from './samples.json'
import bgn from './bgnpcgn.json'
import { Example } from '../components/Example'

export default () => {
  const { repoInfo }: { readmeSections: ReadmeSection[], repoInfo: RepoInfo, mapsInfo: any } =
  useRouteData()

  const [sampleData, setSampleData] = useState([])
  const [bgnData, setBgnData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const Opal = (window as any).Opal as any
      await Opal.Interscript.$on_load()
      const InterscriptMaps = (window as any).InterscriptMaps as any
      const data = await Promise.all(samples.map(async(s) => {
        const text = s.samples.join("\n")
        const { systemName: system } = s
        if (!text || !system) return s
        try {
          const resp: AxiosResponse<any> = await axios.get(`/maps/${system}.json`)
          const { data: json } = resp
          Opal.Interscript.$load_map_json(system, JSON.stringify(json))
          const result = Opal.Interscript.$transliterate(system, text).split("\n");
          return {...s, result }
        } catch (e) {
          console.log(e)
        }
        return s;
      }))
      setSampleData(data)

      const data1 = await Promise.all(bgn.map(async(s) => {
        const text = s.samples.join("\n")
        const { systemName: system } = s
        try {
          if (InterscriptMaps[system] === null) {
            const resp: AxiosResponse<any> = await axios.get(`/maps/${system}.json`)
            const { data: json } = resp
            Opal.Interscript.$load_map_json(system, JSON.stringify(json))
          }
          if (system && !!InterscriptMaps[system]) {
            if (text) {
              const result = Opal.Interscript.$transliterate(system, text).split("\n");
              return {...s, result }
            }
          } else {
            return {...s, todo: true }
          }
        } catch (e) {
          console.log(e)
        }
        return s;
      }))
      setBgnData(data1)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <SectionNav>
        <SectionNavItem
            key="gh"
            href={`https://github.com/${repoInfo.owner}/${repoInfo.name}/`}>
          <strong>View on GitHub</strong>
        </SectionNavItem>
        <SectionNavItem
            key="un-example"
            href={`#un-example`}>
          UN
        </SectionNavItem>
        <SectionNavItem
            key="bgnpcgn-example"
            href={`#bgnpcgn-example`}>
          BGN/PCGB
        </SectionNavItem>
      </SectionNav>
      <SectionGrid>
        { isLoading &&
          <CenterLoader>
            <Loader
              type="Grid"
              color="#00BFFF"
              height={80}
              width={80}
            />
          </CenterLoader>
        }
        { !isLoading &&
          <>
            <Section
                key={'un-example'}
                id={'un-example'}
            >
              <h2>{ `UN Poster examples`}</h2>
              <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i></p>
                    <div style={{display: 'flex'}}>
                      <div style={{flex: 1}}>
                        { sampleData.slice(0, sampleData.length/2).map((s,index) => (
                            <div key={index}>
                              <p> <strong style={{color: '#002060'}}>{s.lang}</strong> [{s.isoName}]
                              </p>
                              <p>
                                { s.samples.map((e: any, i: number) => (
                                    <span key={i}>
                                      { `${e} ${s.result[i] ? s.result[i] : ''}` }
                                      { s.english && !!s.english[i] && <Example samples={s.english[i]} /> }
                                      { i+1 < s.samples.length && ', ' }
                                    </span>
                                ))
                                }
                                <i>{s.systemName ? '' : ' (To be implemented)'}</i>
                              </p>
                            </div>
                          ))
                        }
                      </div>
                      <div style={{flex: 1}}>
                        { sampleData.slice(sampleData.length/2, sampleData.length).map((s,index) => (
                            <div key={index}>
                              <p> <strong style={{color: '#002060'}}>{s.lang}</strong> [{s.isoName}]
                              </p>
                              <p>
                                { s.samples.map((e: any, i: number) => (
                                    <span key={i}>
                                      { `${e} ${s.result[i] ? s.result[i] : ''} ` }
                                      { s.english && !!s.english[i] && <Example samples={s.english[i]} /> }
                                      { i+1 < s.samples.length && ', ' }
                                    </span>
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
            <Section
                key={'bgnpcgn-example'}
                id={'bgnpcgn-example'}
            >
              <h2>{ `BGN/PCGN Poster examples`}</h2>
              <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i></p>
                    <div style={{display: 'flex'}}>
                      <div style={{flex: 1}}>
                        { bgnData.slice(0, bgnData.length/2).map((s,index) => (
                            <div key={index}>
                              <p> <strong style={{color: '#002060'}}>{s.lang}</strong> [{s.isoName}]
                              </p>
                              <p>
                                { s.samples.map((e: any, i: number) => (
                                    <span key={i}>
                                      { `${e} ${s.result[i] ? s.result[i] : ''} ` }
                                      { i+1 < s.samples.length && ', ' }
                                    </span>
                                  ))
                                }
                                <i>{ s.todo ? ' (To be implemented)' : '' }</i>
                              </p>
                            </div>
                          ))
                        }
                      </div>
                      <div style={{flex: 1}}>
                        { bgnData.slice(bgnData.length/2, bgnData.length).map((s,index) => (
                            <div key={index}>
                              <p> <strong style={{color: '#002060'}}>{s.lang}</strong> [{s.isoName}]
                              </p>
                              <p>
                                { s.samples.map((e: any, i: number) => (
                                    <span key={i}>
                                      { `${e} ${s.result[i] ? s.result[i] : ''} ` }
                                      { i+1 < s.samples.length && ', ' }
                                    </span>
                                ))
                                }
                                <i>{ s.todo ? ' (To be implemented)' : '' }</i>
                              </p>
                            </div>
                          ))
                        }
                    </div>
                  </div>
            </Section>
          </>
        }
      </SectionGrid>
    </>
  )
}


const SectionNav = styled.nav`
  margin: 2rem 2rem 1rem 2rem;
  text-align: center;

  @media screen and (min-width: 900px) {
    text-align: unset;
    margin: 2rem 0 1rem 1rem;
  }
`


const SectionNavItem = styled.a`
  display: inline-block;
  margin-right: 1em;

  white-space: nowrap;

  &, &:link, &:visited {
    border-bottom: none;
  }

  @media screen and (min-width: 900px) {
    &::before {
      content: "•";
      display: inline;
      margin: 0 1em 0 0;
    }
  }
`

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
const CenterLoader = styled.div`
  position: fixed;
  z-index: 999;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 50px;
  height: 50px;

  &:before {
    content: '';
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.5);
  }
`
