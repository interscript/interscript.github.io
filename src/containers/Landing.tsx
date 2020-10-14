import React/*, { useState, useEffect, useRef }*/ from 'react'
import { useRouteData } from 'react-static'
import styled from 'styled-components'


export default () => {
  const { foo } = useRouteData();
  return (
    <>
      <SectionGrid>
        <Section>
          <p>Hello world! foo: {foo}</p>
        </Section>
      </SectionGrid>
    </>
  )
}


// const SectionNav = styled.nav`
//   margin: 2rem 2rem 1rem 2rem;
//   text-align: center;
// 
//   @media screen and (min-width: 900px) {
//     text-align: unset;
//     margin: 2rem 0 1rem 1rem;
//   }
// `
// 
// 
// const SectionNavItem = styled.a`
//   display: inline-block;
//   margin-right: 1em;
// 
//   white-space: nowrap;
// 
//   &, &:link, &:visited {
//     border-bottom: none;
//   }
// 
//   @media screen and (min-width: 900px) {
//     &::before {
//       content: "•";
//       display: inline;
//       margin: 0 1em 0 0;
//     }
//   }
// `

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
