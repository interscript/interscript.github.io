import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Loader from 'react-loader-spinner'
import { AxiosResponse } from 'axios'
import { ScriptConversionExample } from '../../types'

import { Poster } from 'components/Example'

import { primaryColor } from '../App'

export const ExamplePage: React.FC<{ samples: ScriptConversionExample[], aggregate?: boolean }
>= ({ samples, aggregate= false }) => {
  const [sampleData, setSampleData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSampleData(samples)
  }, [])

  async function handleForceUpdate() {
    setIsLoading(true)

    const Opal = (window as any).Opal as any
    const mapcache = Opal.hash({});
    await Opal.Interscript.$on_load()

    const translit = async (system: string, text: string) => {
      await Opal.Interscript.$load_maps({
        maps: system,
        path: "/maps/",
        processor: function(a: AxiosResponse) { return a.data }
      });
      return Opal.Interscript.$transliterate(system, text, mapcache).split("\n");
    }

    const prepare = async (samples: ScriptConversionExample[], func: Function) => {
      const data = await Promise.all(samples.map(async(s: ScriptConversionExample) => {
        const text = s.samples.join("\n")
        const { systemName: system } = s
        if(!text || !system ||
            !Opal.Interscript["$map_exist?"](system)) {
          return s
        }
        try {
          const result = await translit(system, text);
          return {...s, result }
        } catch (e) {
          console.log(e)
        }
        return s;
      }))

      func(data)
    }

    await prepare(samples, setSampleData)
    setIsLoading(false)
  }
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
          <>
            <ButtonLayout>
              <ForceUpdateButton onClick={handleForceUpdate}>On Site</ForceUpdateButton>
            </ButtonLayout>
            <Poster data={sampleData} aggregate={aggregate}/>
          </>
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
const ButtonLayout = styled.div`
  text-align: right;
`
const ForceUpdateButton = styled.button`
  flex-shrink: 0;
  margin: 0 .5rem;
  padding: .5rem 1rem;
  border: 0;
  font-size: 100%;
  cursor: pointer;
  color: white;
  background: ${`#${primaryColor}`};
`