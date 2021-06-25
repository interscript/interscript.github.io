import { Link } from '@reach/router';
import React from 'react';
import { useRouteData } from 'react-static';
import styled from 'styled-components';
import { ReadmeSection, RepoInfo } from 'types';

const SectionNavItem = styled.span`
  display: inline-block;
  margin-right: 1em;

  white-space: nowrap;

  &,
  &:link,
  &:visited {
    border-bottom: none;
  }

  @media screen and (min-width: 900px) {
    &::before {
      content: '•';
      display: inline;
      margin: 0 1em 0 0;
    }
  }
`;


const SectionNav = styled.nav`
  margin: 2rem 2rem 1rem 2rem;
  text-align: center;
  outline: none;
  text-decoration: none;
  @media screen and (min-width: 900px) {
    text-align: unset;
    margin: 2rem 0 1rem 1rem;
  }
`;


export function HeaderMenu() {
  const {
    readmeSections,
    repoInfo,
    mapsInfo,
  }: { readmeSections: ReadmeSection[]; repoInfo: RepoInfo; mapsInfo: any } =
    useRouteData();

  return (
    <>
      <SectionNav>

        <Link to="/"><SectionNavItem key="home">Home</SectionNavItem></Link>
        {readmeSections.map((section) => (
          <Link
            key={section.id}
            to={`/#${section.id}`}
          >
            <SectionNavItem dangerouslySetInnerHTML={{ __html: section.titleHTML }}
            />
          </Link>
        ))}
        <SectionNavItem
          key='gh'>
          <a href={`https://github.com/${repoInfo.owner}/${repoInfo.name}/`}>

            <strong>View on GitHub</strong>
          </a>
        </SectionNavItem>
        <Link key='js' to="/js">
          <SectionNavItem >
            <strong>See JS demo</strong>
          </SectionNavItem>
        </Link>
        <Link
          to="/system">
          <SectionNavItem key='system-list'>
            <strong>System List</strong>
          </SectionNavItem>
        </Link>
      </SectionNav>

    </>
  );
};
