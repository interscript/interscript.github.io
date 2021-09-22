export interface ReadmeSection {
    id: string;
    html: string;
    titleHTML: string;
}

export interface RepoInfo {
    owner: string;
    name: string;
}

export interface ScriptConversionExample {
    lang: string;
    isoName: string;
    year?: number;
    systemName: string;
    ogc11122?: string;
    samples: string[];
    english?: string[];
    result: string[];
}

export interface DocFile {
    name: string;
    title: string;
    path: string;
}

export interface PostInfo {
    name: string;
    title: string;
    path: string;
    author: string;
    date: string;
}
