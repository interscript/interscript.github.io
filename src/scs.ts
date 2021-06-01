import type iso639_2_data from 'iso-639-2'
import iso15924_data from '@riboseinc/iso-15924/index-by-code.json'


export type WritingSystemCode = keyof typeof iso15924_data

type LangCode = typeof iso639_2_data[number]["iso6392T"] & typeof iso639_2_data[number]["iso6392T"]


export interface ScriptConversionSystem {
  // ISO 639-2 3-letter code
  lang: LangCode

  // ISO 15924 codes
  source: WritingSystemCode
  target: WritingSystemCode

  authority: string
  id: string
}

function capitalize(s: string): string  {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function systemFromCode(code: string): ScriptConversionSystem {
  const parts = code.split('-')
  const source = capitalize(parts[2]) as WritingSystemCode
  const target = capitalize(parts[3]) as WritingSystemCode

  if (!iso15924_data[source] || !iso15924_data[target]) {
    console.error("Invalid ISCS code", code)
    throw new Error("Invalid ISCS code")
  }

  return {
    authority: parts[0],
    lang: parts[1],
    source,
    target,
    id: parts[4],
  }
}


export function systemToCode(system: ScriptConversionSystem): string {
  return `${system.authority}-${system.lang}-${system.source}-${system.target}-${system.id}`
}
