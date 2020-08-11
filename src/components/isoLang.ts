import iso639_2_data from 'iso-639-2'

export function getLanguageTitleFrom6392BorT(code: string): string | null {
  return iso639_2_data.find(i => i.iso6392T === code || i.iso6392B === code)?.name
}
