import React from "react";
import { Form } from "./Form";
import { InputField } from "./InputField";
import { Select } from './Select';

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
}

export function FilterBar(props: FilterBarProps) {
    const { onSearch, authorities, languages } = props;
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
            </Select>
            <Select
                id="demo-simple-select"
                value={'select'}
            >
                <option value="" disabled selected>Select Source</option>
            </Select>
            <Select
                id="demo-simple-select"
                value={'select'}
                placeholder="Language"

            >
                <option value="" disabled selected>Select Destination</option>
            </Select>
            <InputField
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Filter by name'
            />
         
        </Form>
    )
}
