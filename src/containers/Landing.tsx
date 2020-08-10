import React, { useEffect, useState } from 'react'
import { useRouteData } from 'react-static'
import { ReadmeSection, RepoInfo } from 'types'
import axios, { AxiosResponse } from 'axios'
import iso15924_data from 'iso-15924/index-by-code.json'
import iso639_2_data from 'iso-639-2'
import styled from 'styled-components'


const API_ENDPOINT = 'https://zkjrxjsleh.execute-api.us-east-1.amazonaws.com/prod/interscript';

type WritingSystemCode = keyof typeof iso15924_data;

type LangCode = typeof iso639_2_data[number]["iso6392B"];

interface ScriptConversionSystem {
  // ISO 639-2 3-letter code
  lang: LangCode

  // ISO 15924 codes
  source: WritingSystemCode
  target: WritingSystemCode

  authority: string
  id: string
}


function systemFromCode(code: string): ScriptConversionSystem {
  const parts = code.split('-');
  const source = parts[2] as WritingSystemCode;
  const target = parts[3] as WritingSystemCode;

  if (!iso15924_data[source] || !iso15924_data[target]) {
    console.error("Invalid ISCS code", code);
    throw new Error("Invalid ISCS code");
  }

  return {
    authority: parts[0],
    lang: parts[1],
    source,
    target,
    id: parts[4],
  };
}


function systemToCode(system: ScriptConversionSystem): string {
  return `${system.authority}-${system.lang}-${system.source}-${system.target}-${system.id}`;
}


function getSortedUniqueValues<T, K extends keyof T>(array: T[], key: K): T[K][] {
  const arr: T[K][] = Array.from(new Set(array.map(i => i[key]))).filter(v => v !== undefined);
  arr.sort();
  return arr;
}


export default () => {
  const { readmeSections, repoInfo }: { readmeSections: ReadmeSection[], repoInfo: RepoInfo } = useRouteData()

  return (
    <>
      <SectionGrid>
        <Section>
          <h2>Try it live</h2>
          <LiveDemo />
        </Section>
      </SectionGrid>

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
      </SectionNav>

      <SectionGrid>
        {readmeSections.map(section =>
          <Section
            key={section.id}
            id={section.id}
            dangerouslySetInnerHTML={{ __html: section.html }} />
        )}
      </SectionGrid>
    </>
  )
};


const LiveDemo: React.FC<{}> = function () {
  const [sampleText, setSampleText] = useState<string>('');
  const [selectedSystem, selectSystem] = useState<ScriptConversionSystem | null>(null);
  const [result, setResult] = useState<string | null | undefined>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSystem !== null && sampleText.trim() !== '') {
      setError(null);
      setResult(undefined);
      (async () => {
        let resp: AxiosResponse<any>;
        try {
          resp = await axios({
            method: 'POST',
            url: API_ENDPOINT,
            data: `{transliterate(systemCode: \"${systemToCode(selectedSystem)}\", input: \"${sampleText}\")}`,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (e) {
          setResult(null);
          setError("Sorry, a network error occurred :(");
        }
        setResult(resp.data.data.transliterated);
      })();
    }
  }, [JSON.stringify(selectedSystem), sampleText]);

  let placeholder: string;
  if (selectedSystem?.lang) {
    placeholder = `Enter something in ${iso639_2_data.find(i => i.iso6392B === selectedSystem?.lang)?.name || "selected writing system"}…`;
  } else {
    placeholder = "Enter something…";
  }

  return (
    <>
      <SystemSelector onSelect={selectSystem} />

      <SampleAndResult>

        <SampleTextArea
          value={sampleText}
          placeholder={placeholder}
          onChange={(evt) => setSampleText(evt.currentTarget.value)} />

        <ResultTextArea
          placeholder={selectedSystem === null ? "Select a system above" : undefined}
          disabled
          value={result === undefined ? 'Loading…' : result || error} />

      </SampleAndResult>
    </>
  );
};


const SystemSelector: React.FC<{ onSelect: (system: ScriptConversionSystem | null) => void }> = function ({ onSelect }) {

  // Selected transliteration options
  const [systemSpec, updateSystemSpec] = useState<Partial<ScriptConversionSystem>>({});

  // All supported systems, based on initial API response
  const [supportedSystems, setSupportedSystems] = useState<ScriptConversionSystem[]>([]);

  // Systems available based on selected transliteration options
  // (when all options are selected, this list contains only one item)
  const [availableSystems, setAvailableSystems] = useState<ScriptConversionSystem[]>([]);

  useEffect(() => {
    (async () => {
      // const resp = await axios({
      //   method: 'POST',
      //   url: 'https://zkjrxjsleh.execute-api.us-east-1.amazonaws.com/prod/interscript',
      //   data: '{systemCodes}',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const systemCodes = resp.data.data.systemCodes;

      // While API does not send CORS header:
      const systemCodes = ["bas-rus-Cyrl-Latn-bss","bas-rus-Cyrl-Latn-oss","bgnpcgn-arm-Armn-Latn-1981","bgnpcgn-bul-Cyrl-Latn-2013","bgnpcgn-chn-Hans-Latn-pinyin","bgnpcgn-per-Arab-Latn-1956","bgnpcgn-rus-Cyrl-Latn-1947","bgnpcgn-ukr-Cyrl-Latn-1965","cn-chn-Hans-Latn-pinyin","historic-jpn-Hrkt-Latn-hepburn","icao-bel-Cyrl-Latn-9303","icao-bul-Cyrl-Latn-9303","icao-gre-Grek-Latn-9303","icao-heb-Hebr-Latn-9303","icao-mkd-Cyrl-Latn-9303","icao-per-Arab-Latn-9303","icao-rus-Cyrl-Latn-9303","icao-srp-Cyrl-Latn-9303","icao-ukr-Cyrl-Latn-9303","iso-rus-Cyrl-Latn-iso9","mext-jpn-Hrkt-Latn-hepburn","mext-jpn-Hrkt-Latn-kunrei","un-jpn-Hrkt-Latn-hepburn","un-jpn-Hrkt-Latn-kunrei","un-mon-Mong-Latn-2013"];

      const systems: ScriptConversionSystem[] = systemCodes.map(systemFromCode);

      setSupportedSystems([ ...systems ]);
    })();
  }, []);

  const langCodes = getSortedUniqueValues(supportedSystems, 'lang');
  const sourceSystemCodes = getSortedUniqueValues(supportedSystems, 'source');
  const targetSystemCodes = getSortedUniqueValues(supportedSystems, 'target');
  const authorityCodes = getSortedUniqueValues(supportedSystems, 'authority');
  const systemIDs = getSortedUniqueValues(
    supportedSystems.filter(ss => getSortedUniqueValues(availableSystems, 'authority').indexOf(ss.authority) >= 0),
    'id');

  useEffect(() => {
    if (supportedSystems.length > 0) {
      const availableSystems =  supportedSystems.filter(ss =>
           (systemSpec.lang !== undefined ? ss.lang === systemSpec.lang : true)
        && (systemSpec.source !== undefined ? ss.source === systemSpec.source : true)
        && (systemSpec.target !== undefined ? ss.target === systemSpec.target : true)
        && (systemSpec.authority !== undefined ? ss.authority === systemSpec.authority : true)
        && (systemSpec.id !== undefined ? ss.id === systemSpec.id : true)
      );
      setAvailableSystems(availableSystems);
      autoSelectAll(availableSystems);
    }
  }, [JSON.stringify(systemSpec), JSON.stringify(supportedSystems)]);

  useEffect(() => {
    if (availableSystems.length === 1) {
      onSelect(availableSystems[0]);
    } else {
      onSelect(null);
    }
  }, [JSON.stringify(availableSystems)]);

  function autoSelectAll(availableSystems: ScriptConversionSystem[]) {
    if (getSortedUniqueValues(availableSystems, 'target').length === 1) {
      updateSystemSpec(spec => ({ ...spec, target: availableSystems[0].target }));
    }
    if (getSortedUniqueValues(availableSystems, 'lang').length === 1) {
      updateSystemSpec(spec => ({ ...spec, lang: availableSystems[0].lang }));
    }
    if (getSortedUniqueValues(availableSystems, 'source').length === 1) {
      updateSystemSpec(spec => ({ ...spec, source: availableSystems[0].source }));
    }
    if (getSortedUniqueValues(availableSystems, 'authority').length === 1) {
      updateSystemSpec(spec => ({ ...spec, authority: availableSystems[0].authority }));
    }
    if (systemSpec.authority !== undefined && getSortedUniqueValues(availableSystems, 'id').length === 1) {
      updateSystemSpec(spec => ({ ...spec, id: availableSystems[0].id }));
    }
  }

  return (
    <SystemPropertySelectorGroup>
      <SystemPropertySelector title="Source writing system">
        <SystemPropertyChoiceList>
          {sourceSystemCodes.map(sourceSystemCode =>
            <Choice
                key={sourceSystemCode}
                available={availableSystems.filter(s => s.source === sourceSystemCode).length > 0}
                selected={systemSpec.source === sourceSystemCode}
                onForce={() => updateSystemSpec({ source: sourceSystemCode })}
                onSelect={() => updateSystemSpec(spec => ({ ...spec, source: sourceSystemCode }))}>
              <WritingSystem code={sourceSystemCode} />
            </Choice>
          )}
        </SystemPropertyChoiceList>
      </SystemPropertySelector>

      <SystemPropertySelector title="Language">
        <SystemPropertyChoiceList>
          {langCodes.map(langCode =>
            <Choice
                key={langCode}
                available={availableSystems.filter(s => s.lang === langCode).length > 0}
                selected={systemSpec.lang === langCode}
                onForce={() => updateSystemSpec({ lang: langCode })}
                onSelect={() => updateSystemSpec(spec => ({ ...spec, lang: langCode }))}>
              <Lang code={langCode} />
            </Choice>
          )}
        </SystemPropertyChoiceList>
      </SystemPropertySelector>

      <SystemPropertySelector title="Target writing system">
        <SystemPropertyChoiceList>
          {targetSystemCodes.map(targetSystemCode =>
            <Choice
                key={targetSystemCode}
                available={availableSystems.filter(s => s.target === targetSystemCode).length > 0}
                selected={systemSpec.target === targetSystemCode}
                onForce={() => updateSystemSpec({ target: targetSystemCode })}
                onSelect={() => updateSystemSpec(spec => ({ ...spec, target: targetSystemCode }))}>
              <WritingSystem code={targetSystemCode} />
            </Choice>
          )}
        </SystemPropertyChoiceList>
      </SystemPropertySelector>

      <SystemPropertySelector title="Authority">
        <SystemPropertyChoiceList>
          {authorityCodes.map(authorityCode =>
            <Choice
                key={authorityCode}
                available={availableSystems.filter(s => s.authority === authorityCode).length > 0}
                selected={systemSpec.authority === authorityCode}
                onForce={() => updateSystemSpec({ authority: authorityCode })}
                onSelect={() => updateSystemSpec(spec => ({ ...spec, authority: authorityCode }))}>
              {authorityCode}
            </Choice>
          )}
        </SystemPropertyChoiceList>
      </SystemPropertySelector>

      <SystemPropertySelector title="System ID" style={{ visibility: (systemSpec.authority || systemSpec.id) ? 'visible' : 'hidden' }}>
        <SystemPropertyChoiceList>
          {systemIDs.map(id =>
            <Choice
                key={id}
                available={availableSystems.filter(s => s.id === id).length > 0}
                selected={systemSpec.id === id}
                onForce={() => updateSystemSpec({ authority: systemSpec.authority, id })}
                onSelect={() => updateSystemSpec(spec => ({ ...spec, id }))}>
              {id}
            </Choice>
          )}
        </SystemPropertyChoiceList>
      </SystemPropertySelector>
    </SystemPropertySelectorGroup>
  );
};


const Choice: React.FC<{ available: boolean, selected: boolean, onSelect: () => void, onForce?: () => void }> =
function({ available, selected, onSelect, onForce, children }) {
  const action = available ? onSelect : onForce;
  return (
    <SystemPropertyChoice
        style={{
          fontWeight: selected ? 'bold' : 'normal',
          opacity: available ? 1 : 0.3,
          cursor: !onForce && !available ? 'not-allowed' : 'unset',
        }}>
      <label>
        <SystemPropertyChoiceInput
            type="radio"
            disabled={!onForce && !available}
            checked={selected}
            onChange={(evt) => evt.currentTarget.checked ? action() : void 0}>
        </SystemPropertyChoiceInput>
        {children}
      </label>
    </SystemPropertyChoice>
  );
};


const Lang: React.FC<{ code: string }> = function ({ code }) {
  const lang = iso639_2_data.find(i => i.iso6392B === code);

  if (!lang) {
    console.error("Unsupported ISO 639-2 3-letter language code", code);
    return <>{code}</>;
  }

  return <>{lang.name}</>;
};


const WritingSystem: React.FC<{ code: WritingSystemCode }> = function ({ code }) {
  const system: { Code: string, "English Name": string } | undefined = iso15924_data[code];

  if (!system) {
    console.error("Unsupported ISO 15924 writing system code", code);
    return <>{code}</>;
  }

  return <>{system["English Name"]}</>;
};


const SystemPropertySelector: React.FC<{ title: string, style?: React.CSSProperties }> =
function ({ title, children, style }) {
  return (
    <SystemPropertySelectorWrapper style={style}>
      <h4>{title}</h4>
      {children}
    </SystemPropertySelectorWrapper>
  );
};


const SystemPropertySelectorGroup = styled.div`
  @media screen and (min-width: 900px) {
    display: flex;
    flex-flow: row nowrap;
  }

  > * {
    margin-right: 1rem;
    flex: 1;
  }
`;


const SystemPropertySelectorWrapper = styled.section`
  overflow: hidden;
  border-left: .25rem solid whiteSmoke;
  padding-left: .5rem;
  padding-bottom: 1rem;

  > h4 {
    background: whiteSmoke;
    padding: .5rem;
    margin-left: -.5rem;
    margin-top: 0;
    margin-bottom: .5rem;
    line-height: 1;
    white-space: nowrap;
    font-weight: normal;

    overflow: hidden;
    text-overflow: ellipsis;
  }
`;


const SystemPropertyChoiceList = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  list-style: none;
  overflow: hidden;

  margin: 0;
  && { padding: 0; }
`;


const SystemPropertyChoice = styled.li`
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  > label {
    white-space: nowrap;
    font-size: 90%;
  }
`;


const SystemPropertyChoiceInput = styled.input`
  margin-right: .5rem;
  flex-shrink: 0;
`;


const SampleAndResult = styled.div`
  @media screen and (min-width: 900px) {
    display: flex;
    flex-flow: row nowrap;
  }
`;


const SampleTextArea = styled.textarea`
  width: 100%;
  font-size: 100%;
  padding: .5rem;
  background: whiteSmoke;
  border: 0;
  border-radius: 0 .5rem .5rem .5rem;
`;


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
`;


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
`;

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
`;

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
`;
