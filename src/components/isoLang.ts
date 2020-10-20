import iso639_2_data from 'iso-639-2'
import iso639_3_data from 'iso-639-3'

export function getLanguageTitleFrom6392BorT(code: string): string | null {
  const effectiveCode = code !== 'chn' ? code : 'zho'
  return iso639_2_data.find(i =>
    i.iso6392T === effectiveCode || i.iso6392B === effectiveCode
  )?.name
}

export function getLanguageTitleFrom6393BorT(code: string): string | null {
  return iso639_3_data.find(i =>
    i.iso6392T === code || i.iso6392B === code || i.iso6393 === code
  )?.name
}
