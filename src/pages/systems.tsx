import React, { useState } from "react";
import { useRouteData } from "react-static";
import { Link } from "@reach/router";
import styled from "styled-components";
import { FilterBar, Filters } from "../components/FilterBar";
import { ScriptConversionSystem, systemFromCode } from "../scs";
import { HeaderMenu } from "../components/HeaderMenu";
import { InterscriptMetaDataMap } from "../meta";

function uniq(item: string, pos: number, self: string) {
    return self.indexOf(item) == pos;
}

const SearchHeader = styled.div`
    display: flex;
    width: 881px;
    margin-bottom: 48px;
    place-content: space-between;
    align-items: center;
    margin-top: 24px;
    flex-direction: column;
`;

const Heading = styled.h1`
    margin: 0;
`;

const SystemList = () => {
    const [filter, setFilter] = useState("");
    const {
        mapsInfo,
        metaDataMap,
    }: {
        mapsInfo: any;
        metaDataMap: InterscriptMetaDataMap;
    } = useRouteData();
    const [currentFilter, setCurrentFilter] = useState({
        keyword: "",
        authorityID: "",
        language: "",
        sourceScript: "",
        destinationScript: "",
    });

    const options = mapsInfo.data.map((entry: string) => {
        return systemFromCode(entry);
    });
    const authorities = options
        .map((option: ScriptConversionSystem) => {
            return option.authority;
        })
        .filter(uniq);

    const languages = options
        .map((option: ScriptConversionSystem) => {
            return option.lang;
        })
        .filter(uniq);

    const sourceScripts = options
        .map((option: ScriptConversionSystem) => {
            return option.source;
        })
        .filter(uniq);

    const destinationScripts = options
        .map((option: ScriptConversionSystem) => {
            return option.target;
        })
        .filter(uniq);

    const handleSearch = (search: Filters) => {
        setCurrentFilter({
            authorityID: search.authorityID,
            sourceScript: search.sourceScript,
            keyword: search.keyword,
            language: search.language,
            destinationScript: search.destinationString,
        });
    };

    const formatName = (name: string): string => {
        const MAX_LENGTH = 120;
        if (name.length >= MAX_LENGTH) {
            name = name.substring(0, MAX_LENGTH) + "...";
        }

        return name; //.toUpperCase();
    };
    const list: string[] = mapsInfo.data
        .sort()
        .filter((x: string) => {
            const pass =
                x.includes(currentFilter.keyword) &&
                (currentFilter.authorityID.length === 0 || systemFromCode(x).authority === currentFilter.authorityID) &&
                (currentFilter.destinationScript.length === 0 ||
                    systemFromCode(x).target == currentFilter.destinationScript) &&
                (currentFilter.language.length === 0 || systemFromCode(x).lang == currentFilter.language) &&
                (currentFilter.sourceScript.length === 0 || systemFromCode(x).source == currentFilter.sourceScript);
            return pass;
        })
        .map((system: string) => (
            <dl key={system}>
              <dt>
                <Link to={`/systems/${system}`} key={system}>
                {<code>{system}</code>}
                </Link>
                {" "}(<code>{metaDataMap[system].sourceScript}</code> {" to "}
                  <code>{metaDataMap[system].destinationScript}</code>)
              </dt>
              <dd>
                <Link to={`/systems/${system}`} key={system}>
                  {formatName(metaDataMap[system].name)}
                </Link>
              </dd>
          </dl>
        ));

    return (
        <div>
            <HeaderMenu />
            <SearchHeader>
                <span>Script conversion systems supported: {list.length}</span>
                <p>{`Use the filters below to find your system.`}</p>
                {/* FilterBar */}
                <FilterBar
                    authorities={authorities}
                    languages={languages}
                    sources={sourceScripts}
                    destinations={destinationScripts}
                    onSearch={(search: Filters) => handleSearch(search)}
                />
            </SearchHeader>
            <ul>{list}</ul>
        </div>
    );
};

export default SystemList;
