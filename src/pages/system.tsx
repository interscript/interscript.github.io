import React, { useState } from 'react';
import { useRouteData } from 'react-static';
import { Link } from '@reach/router';
import styled from 'styled-components';
const Form = styled.form`
  outline: 0;
  float: left;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -webkit-border-radius: 4px;
  border-radius: 4px;
`
const TextBox = styled.input`
  outline: 0;
  height: 42px;
  width: 244px;
  line-height: 42px;
  padding: 0 16px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #212121;
  border: 0;
  float: left;
  -webkit-border-radius: 4px 0 0 4px;
  border-radius: 4px 0 0 4px;

`

const SearchButton = styled.button`
  outline: 0;
  background: none;
  background-color: rgba(38, 50, 56, 0.8);
  float: left;
  height: 42px;
  width: 42px;
  text-align: center;
  line-height: 42px;
  border: 0;
  color: #FFF;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: 16px;
  text-rendering: auto;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  -webkit-transition: background-color .4s ease;
  transition: background-color .4s ease;
  -webkit-border-radius: 0 4px 4px 0;
  border-radius: 0 4px 4px 0;
`

const SearchHeader = styled.div`
  display: flex;
  height: 40px;
  width: 100%
  margin-bottom: 48px;
  display: flex;
  place-content: space-between;
  margin-top: 24px;
`

const Heading = styled.h1`
  margin: 0;
`

const SystemList = () => {
  const [ filter, setFilter ] = useState('');
  const {
    mapsInfo,
  }: {
    mapsInfo: any;
  } = useRouteData();
  
  console.log(mapsInfo);
  const list = mapsInfo.data.sort().filter((x: string) => {
    return x.includes(filter);
  }).map((system: string) => (
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
      <Heading>
        System List: {mapsInfo.meta.total}
      </Heading>
        <Form>
        <TextBox onChange={e => setFilter(e.target.value)} placeholder="Search" />
        <SearchButton>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </SearchButton>
        </Form>
      </SearchHeader>
      <ul>{list}</ul>
    </div>
  );
};

export default SystemList;
