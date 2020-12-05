import React from 'react'
import { useRouteData } from 'react-static'
import ExamplePage from '../containers/ExamplePage'
import { ScriptConversionExample } from '../../types'

export default () => {
  const { samples }: { samples: ScriptConversionExample[] } =
  useRouteData()

  return (
    <>
    <h2>{`BGN/PCGN systems`}</h2>
    <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i></p>
    <ExamplePage samples={samples} aggregate={true} authority="BGN/PCGN" />
    </>
  )
}
