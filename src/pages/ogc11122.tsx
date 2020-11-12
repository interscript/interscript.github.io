import React from 'react'
import { useRouteData } from 'react-static'
import ExamplePage from '../containers/ExamplePage'
import { ScriptConversionExample } from '../../types'

export default () => {
  const { samples }: { samples: ScriptConversionExample[] } =
  useRouteData()

  return (
    <>
      <h2>{`OGC 11-122 r1 systems`}</h2>
      <p><i>{ `Each title of a language or a writing system is followed by a note on the appropriate romanization system used (OGC = Open Geospatial Consortium)`}</i></p>
      <ExamplePage samples={samples}/>
    </>
  )
}
