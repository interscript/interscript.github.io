import React from "react";
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
    creationDate: string;
}

export interface FilterBarProps {
    onSearch: (filters: Filters) => void;
    authorities: string[];
    languages: string[];
    sources: string[];
    destination: string[];
}

export function FilterBar(props: FilterBarProps) {
    const { onSearch, authorities, languages, sources, destination } = props;
    const setKeyword = (keyword: string) => {
        console.log(keyword);
    }

    return (
        <Form>
            <Select
                id="demo-simple-select"
                value={'authorityID'}
            >
                <option value="" disabled selected>Select Authority</option>
                {
                    authorities.map((authority) => {
                        return (
                            <option value={authority}>{authority}</option>
                        )
                    })
                }
            </Select>
            <Select
                id="demo-simple-select"
                value={'authorityID'}
            >
                <option value="" disabled selected>Select Language</option>
                {
                    languages.map((language) => {
                        return (
                            <option value={language}>{language}</option>
                        )
                    })
                }
            </Select>
            <Select
                id="demo-simple-select"
                value={'select'}
            >
                <option value="" disabled selected>Select Source</option>
                {
                    sources.map((authority) => {
                        return (
                            <option value={authority}>{authority}</option>
                        )
                    })
                }
            </Select>
            <Select
                id="demo-simple-select"
                value={'select'}
                placeholder="Language"
            >
                <option value="" disabled selected>Select Destination</option>
                {
                    destination.map((dest) => {
                        return (
                            <option value={dest}>{dest}</option>
                        )
                    })
                }
            </Select>
            <InputField
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Filter by name'
            />
            <SearchButton>
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
