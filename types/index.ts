export interface ReadmeSection {
  id: string
  html: string
  titleHTML: string
}

export interface RepoInfo {
  owner: string
  name: string
}

export interface ScriptConversionExample {
  lang: string,
  isoName: string,
  systemName: string,
  samples: string[],
  english?: string[],
  result: string[]
}