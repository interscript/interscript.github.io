import React, { /*useEffect, useRef*/ } from 'react'
// import { useRouteData } from 'react-static'
// import { ReadmeSection, RepoInfo } from 'types'
// import axios, { AxiosResponse } from 'axios'
import styled from 'styled-components'

import UN from '../pages/un'

export default () => {
  // const { repoInfo }: { readmeSections: ReadmeSection[], repoInfo: RepoInfo, mapsInfo: any } =
  // useRouteData()

  // useEffect(() => {

  // }, [])

  return (
    <>
      <SectionGrid>
        <Section
            key={'un-example'}
            id={'un-example'}
        >
          <UN />
        </Section>
      </SectionGrid>
    </>
  )
}



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
    padding: .75rem 1rem;
    margin: 0 -1rem;
  }

  code {
    padding: .1em .5em;
  }

  @media screen and (min-width: 900px) {
    pre {
      margin: 0;
    }
  }
`
