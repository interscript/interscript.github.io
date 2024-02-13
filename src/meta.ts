export interface InterscriptMetaData {
    authorityId?: string;
    id?: string;
    language: string;
    sourceScript: string;
    destinationScript: string;
    name: string;
    url?: string;
    creationDate?: string;
    confirmationDate?: string;
    adoptionDate?: string;
    description?: string;
    notes?: string[];
    nonstandard?: any;
    test: string[] | null;
}

export interface InterscriptMetaDataMap {
    [key: string]: InterscriptMetaData;
}

export interface InterscriptMapsMetaInfo {
    languages: { [key: string]: number };
    meta: { total: number };
    data?: string[];
}
