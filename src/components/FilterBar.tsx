import React, { ChangeEvent, FormEvent, useState } from "react";
import { Form } from "./Form";
import { InputField } from "./InputField";
import { Select } from './Select';
import { SearchButton } from "./SearchButton";
export interface Filters {
    keyword: string;
    authorityID: string;
    language: string;
    sourceScript: string;
    destinationString: string;
}

export interface FilterBarProps {
    onSearch: (filters: Filters) => void;
    authorities: string[];
    languages: string[];
    sources: string[];
    destinations: string[];
}

export function FilterBar(props: FilterBarProps) {
    const { onSearch, authorities, languages, sources, destinations } = props;
    const [keyword, setKeyword] = useState('');
    const [authority, setAuthority] = useState('');
    const [language, setLanguage] = useState('');
    const [sourceScript, setSourceScript] = useState('');
    const [destinationScript, setDestinationScript] = useState('');


    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSearch({
            authorityID: e.target.name === 'authority' ? e.target.value : authority,
            destinationString: e.target.name === 'destination' ? e.target.value : destinationScript,
            keyword: keyword,
            language: e.target.name === 'language' ? e.target.value : language,
            sourceScript: e.target.name === 'source' ? e.target.value : sourceScript
        })
    }

    return (
        <Form onSubmit={(e) => handleSubmit(e)}>
            <Select
                value={authority}
                name="authority"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setAuthority(e.target.value);
                    handleSubmit(e);
                }}

            >
                <option value="">Select Authority</option>
                {
                    authorities.map((authority) => {
                        return (
                            <option key={authority} value={authority}>{authority}</option>
                        )
                    })
                }
            </Select>
            <Select
                value={language}
                name="language"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => { setLanguage(e.target.value); handleSubmit(e); }}
            >
                <option value="">Select Language</option>
                {
                    languages.map((lang) => {
                        return (
                            <option key={lang} value={lang}>{lang}</option>
                        )
                    })
                }
            </Select>
            <Select
                value={sourceScript}
                name="source"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => { setSourceScript(e.target.value); handleSubmit(e); }}
            >
                <option value="">Select Source</option>
                {
                    sources.map((source) => {
                        return (
                            <option key={sourceScript} value={source}>{source}</option>
                        )
                    })
                }
            </Select>
            <Select
                name="destination"
                value={destinationScript}
                onChange={(e) => { setDestinationScript(e.target.value); handleSubmit(e); }}

            >
                <option value="">Select Destination</option>
                {
                    destinations.map((dest) => {
                        return (
                            <option key={dest} value={dest}>{dest}</option>
                        )
                    })
                }
            </Select>
            <InputField
                onChange={(e) => { setKeyword(e.target.value);}}
                value={keyword}
                name="keyword"
                placeholder='Filter by name'
            />
            <SearchButton type="submit">
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    viewBox='0 0 16 16'
                >
                    <path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z' />
                </svg>
            </SearchButton>

        </Form>
    )
}
