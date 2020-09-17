import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import iso15924_data from '@riboseinc/iso-15924/index-by-code.json'
import { primaryColor } from '../App'
import { systemFromCode, ScriptConversionSystem, WritingSystemCode } from '../scs'
import { getLanguageTitleFrom6393BorT } from './isoLang'


function getSortedUniqueValues<T, K extends keyof T>(array: T[], key: K): T[K][] {
  const arr: T[K][] = Array.from(new Set(array.map(i => i[key]))).filter(v => v !== undefined)
  arr.sort()
  return arr
}


export const SystemSelector: React.FC<{ onSelect: (system: ScriptConversionSystem | null) => void,
  systemCodes: string[]
 }> =
function ({ onSelect, systemCodes }) {

  // Selected transliteration options
  const [systemSpec, updateSystemSpec] = useState<Partial<ScriptConversionSystem>>({})

  // All supported systems, based on initial API response
  const [supportedSystems, setSupportedSystems] = useState<ScriptConversionSystem[]>([])

  // Systems available based on selected transliteration options
  // (when all options are selected, this list contains only one item)
  const [availableSystems, setAvailableSystems] = useState<ScriptConversionSystem[]>([])

  useEffect(() => {
    const systems: ScriptConversionSystem[] = systemCodes.map(systemFromCode)
    setSupportedSystems([ ...systems ])
  }, [systemCodes])

  const langCodes = getSortedUniqueValues(supportedSystems, 'lang')
  const sourceSystemCodes = getSortedUniqueValues(supportedSystems, 'source')
  const targetSystemCodes = getSortedUniqueValues(supportedSystems, 'target')
  const authorityCodes = getSortedUniqueValues(supportedSystems, 'authority')
  const systemIDs = getSortedUniqueValues(
    supportedSystems.filter(ss =>
      getSortedUniqueValues(availableSystems, 'authority').indexOf(ss.authority) >= 0
    ),
    'id')

  useEffect(() => {
    if (supportedSystems.length > 0) {
      const availableSystems =  supportedSystems.filter(ss =>
           (systemSpec.lang !== undefined ? ss.lang === systemSpec.lang : true)
        && (systemSpec.source !== undefined ? ss.source === systemSpec.source : true)
        && (systemSpec.target !== undefined ? ss.target === systemSpec.target : true)
        && (systemSpec.authority !== undefined ? ss.authority === systemSpec.authority : true)
        && (systemSpec.id !== undefined ? ss.id === systemSpec.id : true)
      )
      setAvailableSystems(availableSystems)
      autoSelectAll(availableSystems)
    }
  }, [JSON.stringify(systemSpec), JSON.stringify(supportedSystems)])

  useEffect(() => {
    if (availableSystems.length === 1) {
      onSelect(availableSystems[0])
    } else {
      onSelect(null)
    }
  }, [JSON.stringify(availableSystems)])

  function autoSelectAll(availableSystems: ScriptConversionSystem[]) {
    if (getSortedUniqueValues(availableSystems, 'target').length === 1) {
      updateSystemSpec(spec => ({ ...spec, target: availableSystems[0].target }))
    }
    if (getSortedUniqueValues(availableSystems, 'lang').length === 1) {
      updateSystemSpec(spec => ({ ...spec, lang: availableSystems[0].lang }))
    }
    if (getSortedUniqueValues(availableSystems, 'source').length === 1) {
      updateSystemSpec(spec => ({ ...spec, source: availableSystems[0].source }))
    }
    if (getSortedUniqueValues(availableSystems, 'authority').length === 1) {
      updateSystemSpec(spec => ({ ...spec, authority: availableSystems[0].authority }))
    }
    if (systemSpec.authority !== undefined && getSortedUniqueValues(availableSystems, 'id').length === 1) {
      updateSystemSpec(spec => ({ ...spec, id: availableSystems[0].id }))
    }
  }

  return (
    <SystemPropertySelectorGroup>
      <SystemPropertySelector
          title="Source writing system"
          highlighted={!systemSpec.source}>
        <SystemPropertyChoiceList>
          {sourceSystemCodes.map(sourceSystemCode =>
            <Choice
                name={`source-${sourceSystemCode}`}
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

      <SystemPropertySelector
          title="Language"
          highlighted={!systemSpec.lang}>
        <SystemPropertyChoiceList>
          {langCodes.map(langCode =>
            <Choice
                name={`lang-${langCode}`}
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

      <SystemPropertySelector
          title="Target writing system"
          highlighted={!systemSpec.target}>
        <SystemPropertyChoiceList>
          {targetSystemCodes.map(targetSystemCode =>
            <Choice
                name={`target-${targetSystemCode}`}
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

      <SystemPropertySelector
          title="Conversion system authority"
          highlighted={systemSpec.source && systemSpec.target && systemSpec.lang && !systemSpec.authority}>
        <SystemPropertyChoiceList>
          {authorityCodes.map(authorityCode =>
            <Choice
                name={`authority-${authorityCode}`}
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

      <SystemPropertySelector
          title="Conversion system ID"
          highlighted={systemSpec.authority && !systemSpec.id}
          style={{ display: (systemSpec.authority || systemSpec.id) ? 'block' : 'none' }}>
        <SystemPropertyChoiceList>
          {systemIDs.map(id =>
            <Choice
                name={`id-${id}`}
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
  )
}


const Choice: React.FC<{
  name: string
  available: boolean
  selected: boolean
  availableStyle?: React.CSSProperties
  onSelect: () => void
  onForce?: () => void
}> = function({ available, selected, name, onSelect, onForce, availableStyle, children }) {
  const action = available ? onSelect : onForce
  const elID = `system-property-${name}`

  return (
    <SystemPropertyChoice
        style={{
          fontWeight: selected ? 'bold' : 'normal',
          opacity: available ? 1 : 0.3,
          cursor: !onForce && !available ? 'not-allowed' : 'unset',
          ...(availableStyle || {}),
        }}>
      <label htmlFor={elID}>
        <SystemPropertyChoiceInput
            type="radio"
            name={name}
            id={elID}
            disabled={!onForce && !available}
            checked={selected}
            onChange={(evt) => evt.currentTarget.checked ? action() : void 0} />
        {children}
      </label>
    </SystemPropertyChoice>
  )
}


const Lang: React.FC<{ code: string }> = function ({ code }) {
  const lang = getLanguageTitleFrom6393BorT(code)

  if (!lang) {
    console.error("Unsupported ISO 639-2 3-letter language code", code)
    return <>{code}</>
  }

  return <>{lang}</>
};


const WritingSystem: React.FC<{ code: WritingSystemCode }> = function ({ code }) {
  const system: { Code: string, "English Name": string } | undefined = iso15924_data[code]

  if (!system) {
    console.error("Unsupported ISO 15924 writing system code", code)
    return <>{code}</>
  }

  return <>{system && system["English Name"]}</>
};


const SystemPropertySelector: React.FC<{
  title: string
  style?: React.CSSProperties
  highlighted?: boolean
}> =
function ({ title, highlighted, children, style }) {
  const sectionStyle: React.CSSProperties = {
    ...style,
    borderColor: highlighted ? `#${primaryColor}` : undefined,
  }
  const headerStyle: React.CSSProperties = {
    color: highlighted ? 'white' : undefined,
    background: highlighted ? `#${primaryColor}` : undefined,
  }

  return (
    <SystemPropertySelectorWrapper style={sectionStyle}>
      <h4 style={headerStyle}>{title}</h4>
      {children}
    </SystemPropertySelectorWrapper>
  )
}


const SystemPropertySelectorGroup = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;

  > * {
    margin-right: .5rem;
    min-width: 30vw;
    margin-bottom: .5rem;
    flex: 1;
  }

  @media screen and (min-width: 900px) {
    flex-flow: row nowrap;
    align-items: flex-start;

    > * {
      min-width: unset;
      margin-bottom: unset;
    }
  }
`


const SystemPropertySelectorWrapper = styled.section`
  overflow: hidden;
  border-left: .25rem solid whiteSmoke;
  padding-left: .5rem;

  > h4 {
    font-size: 90%;
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
`


const SystemPropertyChoiceList = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  list-style: none;
  overflow: hidden;

  margin: 0;
  && { padding: 0; }
`


const SystemPropertyChoice = styled.li`
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  > label {
    white-space: nowrap;
    font-size: 90%;
  }
`


const SystemPropertyChoiceInput = styled.input`
  margin-right: .5rem;
  flex-shrink: 0;
`
