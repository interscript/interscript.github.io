import { Link } from '@reach/router';
import React from 'react';
import { useRouteData } from 'react-static';
import { ReadmeSection, RepoInfo } from 'types';
import { SectionNav } from './SectionNav';
import { SectionNavItem } from './SectionNavItem';


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
        <Link to='/'>
          <SectionNavItem key='home'>Home</SectionNavItem>
        </Link>
        {readmeSections.map((section) => (
          <Link key={section.id} to={`/#${section.id}`}>
            <SectionNavItem
              dangerouslySetInnerHTML={{ __html: section.titleHTML }}
            />
          </Link>
        ))}
        <SectionNavItem key='gh'>
          <a href={`https://github.com/${repoInfo.owner}/${repoInfo.name}/`}>
            <strong>View on GitHub</strong>
          </a>
        </SectionNavItem>
        <Link key='js' to='/js'>
          <SectionNavItem>
            <strong>See JS demo</strong>
          </SectionNavItem>
        </Link>
        <Link to='/systems'>
          <SectionNavItem key='system-list'>
            <strong>System List</strong>
          </SectionNavItem>
        </Link>
        <Link to='/docs'>
          <SectionNavItem key='docs'>
            <strong>Docs</strong>
          </SectionNavItem>
        </Link>
        <Link to='/blog'>
          <SectionNavItem key='blog'>
            <strong>Blog</strong>
          </SectionNavItem>
        </Link>
      </SectionNav>
    </>
  );
}
