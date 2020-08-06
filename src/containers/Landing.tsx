import React from 'react'
import { useRouteData } from 'react-static'
import { ReadmeSection, RepoInfo } from 'types'
import styled from 'styled-components'

export default () => {
  const { readmeSections, repoInfo }: { readmeSections: ReadmeSection[], repoInfo: RepoInfo } = useRouteData()

  return (
    <>
      <SectionNav>
        {readmeSections.map(section =>
          <SectionNavItem
            key={section.id}
            href={`#${section.id}`}
            dangerouslySetInnerHTML={{ __html: section.titleHTML }} />
        )}
        <SectionNavItem
            key="gh"
            href={`https://github.com/${repoInfo.owner}/${repoInfo.name}/`}>
          <strong>View on GitHub</strong>
        </SectionNavItem>
      </SectionNav>

      <SectionGrid>
        {readmeSections.map(section =>
          <Section
            key={section.id}
            id={section.id}
            dangerouslySetInnerHTML={{ __html: section.html }} />
        )}
      </SectionGrid>
    </>
  )
}

const SectionNav = styled.nav`
  margin: 2rem 2rem 1rem 2rem;
  text-align: center;

  @media screen and (min-width: 800px) {
    text-align: unset;
    margin: 2rem 0 1rem 1rem;
  }
`

const SectionNavItem = styled.a`
  display: inline-block;
  margin-right: 1em;

  white-space: nowrap;

  &, &:link, &:visited {
    border-bottom: none;
  }

  @media screen and (min-width: 800px) {
    &::before {
      content: "•";
      display: inline;
      margin: 0 1em 0 0;
    }
  }
`

const Section = styled.article`
  a.anchor {
    margin-right: .5rem;

    &, &:link, &:visited {
      border: none;
    }
  }
  a[rel*=noopener] {
    &, &:link, &:visited {
      border: none;
    }
  }
`

const GITHUB_HIGHLIGHT_THEME = `
  /*!
  * GitHub Light v0.5.0
  * Copyright (c) 2012 - 2017 GitHub, Inc.
  * Licensed under MIT (https://github.com/primer/github-syntax-theme-generator/blob/master/LICENSE)
  */

  .pl-c /* comment, punctuation.definition.comment, string.comment */ {
    color: #6a737d;
  }

  .pl-c1 /* constant, entity.name.constant, variable.other.constant, variable.language, support, meta.property-name, support.constant, support.variable, meta.module-reference, markup.raw, meta.diff.header, meta.output */,
  .pl-s .pl-v /* string variable */ {
    color: #005cc5;
  }

  .pl-e /* entity */,
  .pl-en /* entity.name */ {
    color: #6f42c1;
  }

  .pl-smi /* variable.parameter.function, storage.modifier.package, storage.modifier.import, storage.type.java, variable.other */,
  .pl-s .pl-s1 /* string source */ {
    color: #24292e;
  }

  .pl-ent /* entity.name.tag, markup.quote */ {
    color: #22863a;
  }

  .pl-k /* keyword, storage, storage.type */ {
    color: #d73a49;
  }

  .pl-s /* string */,
  .pl-pds /* punctuation.definition.string, source.regexp, string.regexp.character-class */,
  .pl-s .pl-pse .pl-s1 /* string punctuation.section.embedded source */,
  .pl-sr /* string.regexp */,
  .pl-sr .pl-cce /* string.regexp constant.character.escape */,
  .pl-sr .pl-sre /* string.regexp source.ruby.embedded */,
  .pl-sr .pl-sra /* string.regexp string.regexp.arbitrary-repitition */ {
    color: #032f62;
  }

  .pl-v /* variable */,
  .pl-smw /* sublimelinter.mark.warning */ {
    color: #e36209;
  }

  .pl-bu /* invalid.broken, invalid.deprecated, invalid.unimplemented, message.error, brackethighlighter.unmatched, sublimelinter.mark.error */ {
    color: #b31d28;
  }

  .pl-ii /* invalid.illegal */ {
    color: #fafbfc;
    background-color: #b31d28;
  }

  .pl-c2 /* carriage-return */ {
    color: #fafbfc;
    background-color: #d73a49;
  }

  .pl-c2::before /* carriage-return */ {
    content: "^M";
  }

  .pl-sr .pl-cce /* string.regexp constant.character.escape */ {
    font-weight: bold;
    color: #22863a;
  }

  .pl-ml /* markup.list */ {
    color: #735c0f;
  }

  .pl-mh /* markup.heading */,
  .pl-mh .pl-en /* markup.heading entity.name */,
  .pl-ms /* meta.separator */ {
    font-weight: bold;
    color: #005cc5;
  }

  .pl-mi /* markup.italic */ {
    font-style: italic;
    color: #24292e;
  }

  .pl-mb /* markup.bold */ {
    font-weight: bold;
    color: #24292e;
  }

  .pl-md /* markup.deleted, meta.diff.header.from-file, punctuation.definition.deleted */ {
    color: #b31d28;
    background-color: #ffeef0;
  }

  .pl-mi1 /* markup.inserted, meta.diff.header.to-file, punctuation.definition.inserted */ {
    color: #22863a;
    background-color: #f0fff4;
  }

  .pl-mc /* markup.changed, punctuation.definition.changed */ {
    color: #e36209;
    background-color: #ffebda;
  }

  .pl-mi2 /* markup.ignored, markup.untracked */ {
    color: #f6f8fa;
    background-color: #005cc5;
  }

  .pl-mdr /* meta.diff.range */ {
    font-weight: bold;
    color: #6f42c1;
  }

  .pl-ba /* brackethighlighter.tag, brackethighlighter.curly, brackethighlighter.round, brackethighlighter.square, brackethighlighter.angle, brackethighlighter.quote */ {
    color: #586069;
  }

  .pl-sg /* sublimelinter.gutter-mark */ {
    color: #959da5;
  }

  .pl-corl /* constant.other.reference.link, string.other.link */ {
    text-decoration: underline;
    color: #032f62;
  }
`

const SectionGrid = styled.div`
  overflow: hidden;
  padding: 0 1rem;

  pre, code {
    font-size: 14px;
    background: whiteSmoke;
    font-family:
      'Iosevka Term SS01', 'Iosevka Term', Iosevka,
      system-ui-monospaced,
      Menlo, 'Courier New', monospace;
  }

  pre {
    overflow-x: auto;
    padding: 1rem;
    margin: 0 -1rem;

    ${GITHUB_HIGHLIGHT_THEME}
  }

  code {
    padding: .1em .5em;
  }

  @media screen and (min-width: 800px) {
    pre {
      margin: 0;
    }
  }
`
