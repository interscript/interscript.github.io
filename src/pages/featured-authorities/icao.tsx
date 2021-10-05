import React from "react";
import { useRouteData } from "react-static";
import ExamplePage from "containers/ExamplePage";
import TopNav from "components/TopNav";
import { ScriptConversionExample } from "types/index";

export default () => {
    const { samples }: { samples: ScriptConversionExample[] } = useRouteData();

    return (
        <>
            <TopNav />
            <h2>{`ICAO MRTD transliteration systems`}</h2>
            <p>
                The <a href="https://www.icao.int">International Civil Aviation Organization</a> (ICAO)
                is a specialized and funding agency of the United Nations for
                the planning and development of international air navigation and
                international air transport.
                It is based in Montreal, Quebec, Canada.
            </p>
            <p>
              The ICAO publishes the "Machine Readable Travel Documents" (MRTD) standard
              which passports worldwide adhere to. Specifically, {" "}
              <a href="https://www.icao.int/publications/pages/publication.aspx?docnum=9303">ICAO Doc 9303 "Machine Readable Travel Documents"</a> {" "}
              defines a set of transliteration systems to be used in such passports
              for the transliteration of non-Latin personal names.
            </p>
            <p>
              Systems listed here are ordered according to the alphabetical order of source language as spelled in
              English.
            </p>
            <p>
              <i>
                NOTE: The title of a language or a writing system is followed by
                the document identifier that describes the system.
              </i>
            </p>

            <ExamplePage samples={samples} authority="ICAO" />
        </>
    );
};
