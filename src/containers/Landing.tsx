import React, { useState, useEffect, useRef } from 'react'
import { useRouteData } from 'react-static'
import { ReadmeSection, RepoInfo } from 'types'
import axios, { AxiosResponse } from 'axios'
import styled from 'styled-components'
import { SystemSelector } from '../components/SystemSelector'

import {
  ScriptConversionSystem,
  systemToCode,
} from '../scs'

import { primaryColor } from '../App'
import { getLanguageTitleFrom6392BorT, getLanguageTitleFrom6393BorT } from 'components/isoLang'
import samples from './samples.json'

const API_ENDPOINT = 'https://api.interscript.com'


export default () => {
  const { readmeSections, repoInfo, mapsInfo }: { readmeSections: ReadmeSection[], repoInfo: RepoInfo, mapsInfo: any } =
  useRouteData()

  const [showDemo, setShowDemo] = useState(false)
  const [demoIsShowable, setDemoIsShowable] = useState(false)
  const [sampleData, setSampleData] = useState([])

  useEffect(() => {
    // Ensures interactive elements are not included in static HTML
    setDemoIsShowable(true)

    // Show demo by default only on wide viewports
    if (window.innerWidth >= 900) {
      setShowDemo(true)
    }

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

  const summary = Object.keys(mapsInfo.languages).map(alpha3 => `${getLanguageTitleFrom6393BorT(alpha3)} (${mapsInfo.languages[alpha3]})`).sort().join(', ');

  return (
    <>
      <SectionNav>
        {readmeSections.map(section =>
          <SectionNavItem
            key={section.id}
            href={`#${section.id}`}
            dangerouslySetInnerHTML={{ __html: section.titleHTML }} />
        )}
        <SectionNavItem
            key="gh"
            href={`https://github.com/${repoInfo.owner}/${repoInfo.name}/`}>
          <strong>View on GitHub</strong>
        </SectionNavItem>
        <SectionNavItem
            key="ex"
            href={`#example`}>
          Examples
        </SectionNavItem>
      </SectionNav>

      <SectionGrid>
        <Section>
          <p>{ `The live demo supports ${mapsInfo?.meta.total} transliteration systems.` } </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        {demoIsShowable
          ? <Section>
              <h2>
                <a href="javascript: void 0;" onClick={() => setShowDemo(!showDemo)}>
                  {showDemo ? "Hide live demo" : "Try it live"}
                </a>
              </h2>
              {showDemo
                ? <LiveDemo />
                : null}
            </Section>
          : null}

        {readmeSections.map(section =>
          <Section
            key={section.id}
            id={section.id}
            dangerouslySetInnerHTML={{ __html: section.html }} />
        )}
      </SectionGrid>

      <SectionGrid>
        <Section>
          <h2>{ `Statistics`}</h2>
          <p>{ summary }</p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section>
          <h2>{ `Copyright`}</h2>
          <p>{ `Ribose© 2020. All rights reserved.`}</p>
        </Section>
      </SectionGrid>

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


const LiveDemo: React.FC<{}> = function () {
  const [sampleText, setSampleText] = useState<string>('')
  const [selectedSystem, selectSystem] = useState<ScriptConversionSystem | null>(null)
  const [result, setResult] = useState<string | null | undefined>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [systemCodes, setSystemCodes] = useState<string[]>([])

  const sampleInputRef = useRef<HTMLTextAreaElement>(null)

  const systemCode: string | null = selectedSystem !== null
    ? systemToCode(selectedSystem)
    : null

  useEffect(() => {
    setError(null)
    setSubmitted(false)

  }, [systemCode, sampleText])

  useEffect(() => {
    if (systemCode) {
      sampleInputRef.current?.focus();
    }
  }, [systemCode])

  useEffect(() => {
    (async () => {
      const resp: AxiosResponse<any> = await axios({
        method: 'POST',
        url: API_ENDPOINT,
        data: '{systemCodes}',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSystemCodes(resp.data?.data?.systemCodes || [])
    })()
  }, [])

  async function handleConvert() {
    if (systemCode !== null && sampleText.trim() !== '') {
      let resp: AxiosResponse<any>

      setError(null)
      setResult(undefined)
      setSubmitted(true)

      try {
        resp = await axios({
          method: 'POST',
          url: API_ENDPOINT,
          data: `{transliterate(systemCode: \"${systemCode}\", input: \"${sampleText}\")}`,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (e) {
        setResult(null)
        setSubmitted(false)
        setError("Sorry, an error occurred :(")
      }
      setResult(resp.data?.data?.transliterate || "No result returned, please check your sample!")
    }
  }

  let placeholder: string
  if (selectedSystem?.lang) {
    placeholder = `Enter something in ${getLanguageTitleFrom6392BorT(selectedSystem.lang) || "selected writing system"}…`
  } else {
    placeholder = "Enter something…"
  }

  return (
    <>
      <SystemSelector onSelect={selectSystem} systemCodes={systemCodes} />

      <SampleAndResult>

        <SampleTextArea
          ref={sampleInputRef}
          value={sampleText}
          placeholder={placeholder}
          style={{ boxShadow: (sampleText.trim() === '' && systemCode !== null)
            ? `#${primaryColor} 0 0 0px .5rem`
            : undefined }}
          onChange={(evt) => setSampleText(evt.currentTarget.value)} />

        <ConvertButton
            onClick={handleConvert}
            disabled={submitted === true || systemCode === null || sampleText.trim() === ''}>
          Convert &rarr;
        </ConvertButton>

        <ResultTextArea
          placeholder={selectedSystem === null ? "Select a system above" : undefined}
          disabled
          value={result === undefined ? 'Loading…' : result || error || ''} />

      </SampleAndResult>

      {systemCode !== null
        ? <p><small>Selected script conversion system code:&emsp;<code>{systemCode}</code></small></p>
        : null}
    </>
  )
}


const ConvertButton = styled.button`
  flex-shrink: 0;
  margin: 0 .5rem;
  padding: .5rem 1rem;
  border: 0;
  font-size: 100%;

  color:
    ${props => props.disabled ? 'silver' : `white`};

  background:
    ${props => props.disabled ? 'whiteSmoke' : `#${primaryColor}`};
`


const SampleAndResult = styled.div`
  margin-top: 1rem;

  > :first-child, > :last-child {
    width: 100%;
  }

  @media screen and (min-width: 900px) {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;

    > :first-child, > :last-child {
      flex: 1;
      width: unset;
    }
  }
`


const SampleTextArea = styled.textarea`
  font-size: 100%;
  padding: .5rem;
  margin: 0;
  background: whiteSmoke;
  border: 0;
  z-index: 2;
  display: block;
`


const ResultTextArea = styled(SampleTextArea)`
  cursor: default;
`


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

const GITHUB_HIGHLIGHT_THEME = `
  /*!
  * GitHub Light v0.5.0
  * Copyright (c) 2012 - 2017 GitHub, Inc.
  * Licensed under MIT (https://github.com/primer/github-syntax-theme-generator/blob/master/LICENSE)
  */

  .pl-c /* comment, punctuation.definition.comment, string.comment */ {
    color: #6a737d;
  }

  .pl-c1 /* constant, entity.name.constant, variable.other.constant, variable.language, support, meta.property-name, support.constant, support.variable, meta.module-reference, markup.raw, meta.diff.header, meta.output */,
  .pl-s .pl-v /* string variable */ {
    color: #005cc5;
  }

  .pl-e /* entity */,
  .pl-en /* entity.name */ {
    color: #6f42c1;
  }

  .pl-smi /* variable.parameter.function, storage.modifier.package, storage.modifier.import, storage.type.java, variable.other */,
  .pl-s .pl-s1 /* string source */ {
    color: #24292e;
  }

  .pl-ent /* entity.name.tag, markup.quote */ {
    color: #22863a;
  }

  .pl-k /* keyword, storage, storage.type */ {
    color: #d73a49;
  }

  .pl-s /* string */,
  .pl-pds /* punctuation.definition.string, source.regexp, string.regexp.character-class */,
  .pl-s .pl-pse .pl-s1 /* string punctuation.section.embedded source */,
  .pl-sr /* string.regexp */,
  .pl-sr .pl-cce /* string.regexp constant.character.escape */,
  .pl-sr .pl-sre /* string.regexp source.ruby.embedded */,
  .pl-sr .pl-sra /* string.regexp string.regexp.arbitrary-repitition */ {
    color: #032f62;
  }

  .pl-v /* variable */,
  .pl-smw /* sublimelinter.mark.warning */ {
    color: #e36209;
  }

  .pl-bu /* invalid.broken, invalid.deprecated, invalid.unimplemented, message.error, brackethighlighter.unmatched, sublimelinter.mark.error */ {
    color: #b31d28;
  }

  .pl-ii /* invalid.illegal */ {
    color: #fafbfc;
    background-color: #b31d28;
  }

  .pl-c2 /* carriage-return */ {
    color: #fafbfc;
    background-color: #d73a49;
  }

  .pl-c2::before /* carriage-return */ {
    content: "^M";
  }

  .pl-sr .pl-cce /* string.regexp constant.character.escape */ {
    font-weight: bold;
    color: #22863a;
  }

  .pl-ml /* markup.list */ {
    color: #735c0f;
  }

  .pl-mh /* markup.heading */,
  .pl-mh .pl-en /* markup.heading entity.name */,
  .pl-ms /* meta.separator */ {
    font-weight: bold;
    color: #005cc5;
  }

  .pl-mi /* markup.italic */ {
    font-style: italic;
    color: #24292e;
  }

  .pl-mb /* markup.bold */ {
    font-weight: bold;
    color: #24292e;
  }

  .pl-md /* markup.deleted, meta.diff.header.from-file, punctuation.definition.deleted */ {
    color: #b31d28;
    background-color: #ffeef0;
  }

  .pl-mi1 /* markup.inserted, meta.diff.header.to-file, punctuation.definition.inserted */ {
    color: #22863a;
    background-color: #f0fff4;
  }

  .pl-mc /* markup.changed, punctuation.definition.changed */ {
    color: #e36209;
    background-color: #ffebda;
  }

  .pl-mi2 /* markup.ignored, markup.untracked */ {
    color: #f6f8fa;
    background-color: #005cc5;
  }

  .pl-mdr /* meta.diff.range */ {
    font-weight: bold;
    color: #6f42c1;
  }

  .pl-ba /* brackethighlighter.tag, brackethighlighter.curly, brackethighlighter.round, brackethighlighter.square, brackethighlighter.angle, brackethighlighter.quote */ {
    color: #586069;
  }

  .pl-sg /* sublimelinter.gutter-mark */ {
    color: #959da5;
  }

  .pl-corl /* constant.other.reference.link, string.other.link */ {
    text-decoration: underline;
    color: #032f62;
  }
`;

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

    ${GITHUB_HIGHLIGHT_THEME}
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
