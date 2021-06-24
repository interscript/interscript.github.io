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
                {readmeSections.map((section) => (
                    <SectionNavItem
                        key={section.id}
                        href={`#${section.id}`}
                        dangerouslySetInnerHTML={{ __html: section.titleHTML }}
                    />
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
                <SectionNavItem key='system-list' href='/system'>
                    <strong>System List</strong>
                </SectionNavItem>
            </SectionNav>

        </>
    );
};
