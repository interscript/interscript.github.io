import React, { useState, useEffect/*, useRef*/ } from 'react'
import { useRouteData } from 'react-static'
import { ReadmeSection, RepoInfo } from 'types'
// import axios, { AxiosResponse } from 'axios'
import styled from 'styled-components'
import Loader from 'react-loader-spinner'

import samples from './samples.json'
import bgn from './bgnpcgn.json'
import alalc from './alalc.json'
import odni from './odni.json'
import { Poster } from 'components/Example'

export default () => {
  const { repoInfo }: { readmeSections: ReadmeSection[], repoInfo: RepoInfo, mapsInfo: any } =
  useRouteData()

  const [sampleData, setSampleData] = useState([])
  const [bgnData, setBgnData] = useState([])
  const [alalcData, setAlalcData] = useState([])
  const [odniData, setOdniData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const data = samples

      // const Opal = (window as any).Opal as any
      // const mapcache = Opal.hash({});
      // await Opal.Interscript.$on_load()
      // const InterscriptMaps = (window as any).InterscriptMaps as any

      /*
      const data = await Promise.all(samples.map(async(s) => {
        const text = s.samples.join("\n")
        const { systemName: system } = s
        if (!text || !system) return s
        try {
          const resp: AxiosResponse<any> = await axios.get
          (`/maps/${system}.json`)
          const { data: json } = resp
          Opal.Interscript.$load_map_json(system, JSON.stringify(json))
          const result = Opal.Interscript.$transliterate(system, text, mapcache).split("\n");
          return {...s, result }
        } catch (e) {
          console.log(e)
        }
        return s;
      }))
      */
      setSampleData(data)
      /*
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
              const result = Opal.Interscript.$transliterate(system, text, mapcache).split("\n");
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
      */
      const data1 = bgn
      setBgnData(data1)
      /*
      const data2 = await Promise.all(alalc.map(async(s) => {
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
              const result = Opal.Interscript.$transliterate(system, text, mapcache).split("\n");
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
      */
      const data2 = alalc
      setAlalcData(data2)

      // const data3 = await Promise.all(odni.map(async(s) => {
      //   const text = s.samples.join("\n")
      //   const { systemName: system } = s
      //   try {
      //     if (InterscriptMaps[system] === null) {
      //       const resp: AxiosResponse<any> = await axios.get(`/maps/${system}.json`)
      //       const { data: json } = resp
      //       Opal.Interscript.$load_map_json(system, JSON.stringify(json))
      //     }
      //     if (system && !!InterscriptMaps[system]) {
      //       if (text) {
      //         const result = Opal.Interscript.$transliterate(system, text, mapcache).split("\n");
      //         return {...s, result }
      //       }
      //     } else {
      //       return {...s, todo: true }
      //     }
      //   } catch (e) {
      //     console.log(e)
      //   }
      //   return s;
      // }))
      // setOdniData(data3)
      const data3 = odni
      setOdniData(data3)

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
          BGN/PCGN
        </SectionNavItem>
        <SectionNavItem
          key="alalc-example"
          href={`#alalc-example`}>
          ALA-LC
        </SectionNavItem>
        <SectionNavItem
          key="odni-example"
          href={`#odni-example`}>
          ODNI
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
              <h2>{ `UN systems`}</h2>
              <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i></p>
              <Poster data={sampleData} />
            </Section>
            <Section
                key={'bgnpcgn-example'}
                id={'bgnpcgn-example'}
            >
              <h2>{ `BGN/PCGN systems`}</h2>
              <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i></p>
              <Poster data={bgnData} />
            </Section>
            <Section
                key={'alalc-example'}
                id={'alalc-example'}
            >
                <h2>{ `ALA/LC systems`}</h2>
                <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (ALA-LC = American Library Association - Library of Congress)`}</i></p>
                <Poster data={alalcData} />
            </Section>
              <Section
                  key={'odni-example'}
                  id={'odni-example'}
              >
                  <h2>{ `ODNI systems`}</h2>
                  <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (ODNI = Office of the Director of National Intelligence)`}</i></p>
                  <Poster data={odniData} />
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
