import iso639_2_data from 'iso-639-2'

export function getLanguageTitleFrom6392BorT(code: string): string | null {
  const effectiveCode = code !== 'chn' ? code : 'zho'
  return iso639_2_data.find(i =>
    i.iso6392T === effectiveCode || i.iso6392B === effectiveCode
  )?.name
}
