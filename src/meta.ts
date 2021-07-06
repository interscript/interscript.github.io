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
}

export interface InterscriptMetaDataMap {
    [key: string]: InterscriptMetaData;
}
