import { Link } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { useRouteData } from 'react-static';
import styled from 'styled-components';
import { ReadmeSection, RepoInfo } from 'types';
import { GITHUB_HIGHLIGHT_THEME } from './GithubHightlightTheme';

const SectionNavItem = styled.a`
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

        {window.location.pathname !== '/' && <Link to="/"><SectionNavItem key="home" href="/">Home</SectionNavItem></Link>}
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
          key='gh'
          href={`https://github.com/${repoInfo.owner}/${repoInfo.name}/`}
        >
          <strong>View on GitHub</strong>
        </SectionNavItem>
        <SectionNavItem key='js' href='/js'>
          <strong>See JS demo</strong>
        </SectionNavItem>
        <Link
          to="/systems">
          <SectionNavItem key='system-list'>
            <strong>System List</strong>
          </SectionNavItem>
        </Link>
      </SectionNav>

    </>
  );
};
