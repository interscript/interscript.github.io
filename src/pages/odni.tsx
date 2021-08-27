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
            <h2>{`ODNI Foreign Language Transliteration Standards`}</h2>
            <p>
              The <a href="https://www.odni.gov">Office of the Director of National Intelligence (ODNI)</a> {" "}
              maintains the Intelligence Community Standard 630-01 in accordance with {" "}
              <a href="https://www.dni.gov/files/documents/ICD/ICD_630.pdf">Intelligence Community Directives 630-01</a> "Intelligence Community Foreign Language Capability".
            </p>
            <p>
              ICS 630-01 "Foreign Language Transliteration Standards" (UNCLASSIFIED)
              provides standard methods to Romanize personal and place names
              originating from non-Latin scripts.
            </p>
            <p>
              Systems listed here are ordered according to the alphabetical order
              of source language as spelled in English.
            </p>
            <p>
                <i>
                  NOTE: The title of a language or a writing system is followed
                  by the year of which the system was enacted.
                </i>
            </p>
            <ExamplePage samples={samples} authority="ODNI" />
        </>
    );
};
