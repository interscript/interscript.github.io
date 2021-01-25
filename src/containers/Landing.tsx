import React, { useState, useEffect, useRef } from 'react'
import { useRouteData } from 'react-static'
import { ReadmeSection, RepoInfo } from 'types'
import { AxiosResponse } from 'axios'
import styled from 'styled-components'
import { SystemSelector } from '../components/SystemSelector'

import { ScriptConversionSystem, systemToCode } from '../scs'

import { primaryColor } from '../App'
import { getLanguageTitleFrom6392or3 } from 'components/isoLang'

export default () => {
  const {
    readmeSections,
    /* repoInfo, */ mapsInfo,
  }: {
    readmeSections: ReadmeSection[]
    repoInfo: RepoInfo
    mapsInfo: any
  } = useRouteData()

  const [showDemo, setShowDemo] = useState(false)
  const [demoIsShowable, setDemoIsShowable] = useState(false)

  useEffect(() => {
    // Ensures interactive elements are not included in static HTML
    setDemoIsShowable(true)

    // Show demo by default only on wide viewports
    if (window.innerWidth >= 900) {
      setShowDemo(true)
    }
  }, [])

  const summary = Object.keys(mapsInfo.languages)
    .map(
      (alpha3) =>
        `${getLanguageTitleFrom6392or3(alpha3)} (${mapsInfo.languages[alpha3]})`
    )
    .sort()
    .join(', ')

  return (
    <>
      <SectionGrid>
        <Section>
          <p>
            {`The live demo supports ${mapsInfo?.meta.total} transliteration systems.`}{' '}
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        {demoIsShowable ? (
          <Section>
            <h2>
              <a
                href='javascript: void 0;'
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? 'Hide live demo' : 'Try it live'}
              </a>
            </h2>
            {showDemo ? <LiveDemo /> : null}
          </Section>
        ) : null}

        {readmeSections.map((section) => (
          <Section
            key={section.id}
            id={section.id}
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
        ))}
      </SectionGrid>

      <SectionGrid>
        <Section>
          <h2>{`Statistics`}</h2>
          <p>{summary}</p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section>
          <h2>{`Copyright`}</h2>
          <p>{`Ribose© 2020. All rights reserved.`}</p>
        </Section>
      </SectionGrid>
    </>
  )
}

const LiveDemo: React.FC<{}> = function () {
  const [sampleText, setSampleText] = useState<string>('')
  const [
    selectedSystem,
    selectSystem,
  ] = useState<ScriptConversionSystem | null>(null)
  const [result, setResult] = useState<string | null | undefined>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [systemCodes, setSystemCodes] = useState<string[]>([])

  const sampleInputRef = useRef<HTMLTextAreaElement>(null)

  const systemCode: string | null =
    selectedSystem !== null ? systemToCode(selectedSystem) : null

  useEffect(() => {
    setError(null)
    setSubmitted(false)
  }, [systemCode, sampleText])

  useEffect(() => {
    if (systemCode) {
      sampleInputRef.current?.focus()
    }

    ;(async () => {
      let test: string | null
      if (systemCode !== null) {
        test = await getTestExample(systemCode)
        if (test !== null) {
          setSampleText(test)
        }
      }
    })()
  }, [systemCode])

  useEffect(() => {
    ;(async () => {
      const InterscriptMaps: any = (window as any).InterscriptMaps
      setSystemCodes(Object.keys(InterscriptMaps) || [])
    })()
  }, [])

  async function getTestExample(system: string) {
    const Opal = (window as any).Opal as any
    await Opal.Interscript.$on_load()

    await Opal.Interscript.$load_maps({
      maps: system,
      path: '/maps/',
      processor: function (a: AxiosResponse) {
        return a.data
      },
    })

    const map = JSON.parse(Opal.global.InterscriptMaps[system])

    return map.tests && map.tests.length > 0 ? map.tests[0].source : null
  }

  async function handleConvert() {
    if (systemCode !== null && sampleText.trim() !== '') {
      let resp: string

      setError(null)
      setResult(undefined)
      setSubmitted(true)

      const Opal = (window as any).Opal as any
      const mapcache = Opal.hash({})
      await Opal.Interscript.$on_load()

      const translit = async (system: string, text: string) => {
        await Opal.Interscript.$load_maps({
          maps: system,
          path: '/maps/',
          processor: function (a: AxiosResponse) {
            return a.data
          },
        })
        return Opal.Interscript.$transliterate(system, text, mapcache).split(
          '\n'
        )
      }

      try {
        resp = await translit(systemCode, sampleText)
      } catch (e) {
        setResult(null)
        setSubmitted(false)
        setError('Sorry, an error occurred :(')
      }
      setResult(resp || 'No result returned, please check your sample!')
    }
  }

  let placeholder: string
  if (selectedSystem?.lang) {
    placeholder = `Enter something in ${
      getLanguageTitleFrom6392or3(selectedSystem.lang) ||
      'selected writing system'
    }…`
  } else {
    placeholder = 'Enter something…'
  }

  return (
    <>
      <SystemSelector onSelect={selectSystem} systemCodes={systemCodes} />

      <SampleAndResult>
        <SampleTextArea
          ref={sampleInputRef}
          value={sampleText}
          placeholder={placeholder}
          style={{
            boxShadow:
              sampleText.trim() === '' && systemCode !== null
                ? `#${primaryColor} 0 0 0px .5rem`
                : undefined,
          }}
          onChange={(evt) => setSampleText(evt.currentTarget.value)}
        />

        <ConvertButton
          onClick={handleConvert}
          disabled={
            submitted === true ||
            systemCode === null ||
            sampleText.trim() === ''
          }
        >
          Convert &rarr;
        </ConvertButton>

        <ResultTextArea
          placeholder={
            selectedSystem === null ? 'Select a system above' : undefined
          }
          disabled
          value={result === undefined ? 'Loading…' : result || error || ''}
        />
      </SampleAndResult>

      {systemCode !== null ? (
        <p>
          <small>
            Selected script conversion system code:&emsp;
            <code>{systemCode}</code>
          </small>
        </p>
      ) : null}
    </>
  )
}

const ConvertButton = styled.button`
  flex-shrink: 0;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: 0;
  font-size: 100%;

  color: ${(props) => (props.disabled ? 'silver' : `white`)};

  background: ${(props) =>
    props.disabled ? 'whiteSmoke' : `#${primaryColor}`};
`

const SampleAndResult = styled.div`
  margin-top: 1rem;

  > :first-child,
  > :last-child {
    width: 100%;
  }

  @media screen and (min-width: 900px) {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;

    > :first-child,
    > :last-child {
      flex: 1;
      width: unset;
    }
  }
`

const SampleTextArea = styled.textarea`
  font-size: 100%;
  padding: 0.5rem;
  margin: 0;
  background: whiteSmoke;
  border: 0;
  z-index: 2;
  display: block;
`

const ResultTextArea = styled(SampleTextArea)`
  cursor: default;
`

//
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
    margin-right: 0.5rem;

    &,
    &:link,
    &:visited {
      border: none;
    }
  }
  a[rel*='noopener'] {
    &,
    &:link,
    &:visited {
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
`

const SectionGrid = styled.div`
  overflow: hidden;
  padding: 0 1rem;

  pre,
  code {
    font-size: 14px;
    background: whiteSmoke;
    font-family: 'Iosevka Term SS01', 'Iosevka Term', Iosevka,
      system-ui-monospaced, Menlo, 'Courier New', monospace;
  }

  pre {
    overflow-x: auto;
    padding: 0.75rem 1rem;
    margin: 0 -1rem;

    ${GITHUB_HIGHLIGHT_THEME}
  }

  code {
    padding: 0.1em 0.5em;
  }

  @media screen and (min-width: 900px) {
    pre {
      margin: 0;
    }
  }
`
