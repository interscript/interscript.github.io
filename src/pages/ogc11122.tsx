import React from "react";
import { useRouteData } from "react-static";
import ExamplePage from "containers/ExamplePage";
import TopNav from "components/TopNav";
import { ScriptConversionExample } from "../../types";

export default () => {
  const { samples }: { samples: ScriptConversionExample[] } = useRouteData();

  return (
    <>
      <TopNav />

      <h2>{`OGC 11-122 r1 systems`}</h2>
      <p>
        <i>{`Each title of a language or a writing system is followed by a note on the appropriate romanization system used (OGC = Open Geospatial Consortium)`}</i>
      </p>
      <p>
        <i>
          The systems listed here are ordered according to the "OGC 11-122r1
          Gazetteer Service - Application Profile of the Web Feature Service
          Best Practice (1.0)" document, available &nbsp;
          <a href="https://www.ogc.org/standards/wfs" target="_blank">
            here
          </a>
          .
        </i>
      </p>
      <ExamplePage samples={samples} />
    </>
  );
};
