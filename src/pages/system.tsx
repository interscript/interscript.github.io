import React, { useState } from 'react';
import { useRouteData } from 'react-static';
import { Link } from '@reach/router';
import styled from 'styled-components';
import { FilterBar, Filters } from '../components/FilterBar';


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
    created: '',
  });
  console.log('mapsInfo', mapsInfo);

  const handleSearch = (search: Filters) => {
    setCurrentFilter({
      authorityID: search.authorityID,
      created: search.creationDate,
      sourceScript: search.sourceScript,
      keyword: search.keyword,
      language: search.language,
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
          authorities={['author1', 'author2']} 
          languages={['pl','en']}
          onSearch={(search: Filters) => handleSearch(search)} 
        />
      </SearchHeader>
      <ul>{list}</ul>
    </div>
  );
};

export default SystemList;
