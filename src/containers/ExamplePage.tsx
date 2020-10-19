import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Loader from 'react-loader-spinner'

import { Poster } from 'components/Example'

export const ExamplePage: React.FC<{ sampleName: string }
>= ({ sampleName }) => {
  const samples = require(`./${sampleName}.json`)
  const [sampleData, setSampleData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const data = samples
      setSampleData(data)
      setIsLoading(false)
    })()
  })

  return (
    <Section>
      { isLoading &&
        <CenterLoader>
          <Loader
            type="Grid"
            color="#00BFFF"
            height={80}
            width={80}
          />
        </CenterLoader>
      }
      { !isLoading &&
          <Poster data={sampleData} />
      }
    </Section>
  )
}

export default ExamplePage

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
const CenterLoader = styled.div`
  position: fixed;
  z-index: 999;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 50px;
  height: 50px;

  &:before {
    content: '';
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.5);
  }
`