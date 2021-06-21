import React, { useState } from 'react';
import { useRouteData } from 'react-static';
import { Link } from '@reach/router';
import styled from 'styled-components';
import { FilterBar, Filters } from '../components/FilterBar';
import { ScriptConversionSystem, systemFromCode } from '../scs';


function uniq(item: string, pos: number, self: string) {
  return self.indexOf(item) == pos;
}

const SearchHeader = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 48px;
  place-content: space-between;
  margin-top: 24px;
  flex-direction: column;
`;

const Heading = styled.h1`
  margin: 0;
`;

const SystemList = () => {
  const {
    mapsInfo,
  }: {
    mapsInfo: any;
  } = useRouteData();
  const [ currentFilter, setCurrentFilter ] = useState({
    keyword: '',
    authorityID: null,
    language: 'en',
    sourceScript: '',
    destinationScript: '',
    created: '',
  });

  const options = mapsInfo.data.map((entry: string) => {
    return systemFromCode(entry);
  });
  const authorities = options.map((option: ScriptConversionSystem) => {
    return option.authority;
  }).filter(uniq);

  const languages = options.map((option: ScriptConversionSystem) => {
    return option.authority;
  }).filter(uniq);

  const sourceScripts = options.map((option: ScriptConversionSystem) => {
    return option.source;
  }).filter(uniq);

  console.log(authorities);
  const handleSearch = (search: Filters) => {
    setCurrentFilter({
      authorityID: search.authorityID,
      created: search.creationDate,
      sourceScript: search.sourceScript,
      keyword: search.keyword,
      language: search.language,
      destinationScript: search.destinationString
    });
  }

  const list: string[] = mapsInfo.data
    .sort()
    .filter((x: string) => {
      return !currentFilter.keyword || x.includes(currentFilter.keyword);
    })
    .map((system: string) => (
      <li>
        <Link to={`/system/${system}`} key={system}>
          {system}
        </Link>
      </li>
    ));

  return (
    <div>
      <Link to='/'>Home</Link>
      <SearchHeader>
        <span>System List: {list.length}</span>
        {/* FilterBar */}
        <FilterBar 
          authorities={authorities} 
          languages={languages}
          onSearch={(search: Filters) => handleSearch(search)} 
        />
      </SearchHeader>
      <ul>{list}</ul>
    </div>
  );
};

export default SystemList;
