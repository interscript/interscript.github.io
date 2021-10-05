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
            <h2>{`DIN Romanization systems`}</h2>
            <p>
              <a href="https://www.din.de">Deutsches Institut für Normung e.V.</a> {" "}
                (DIN) is the German national organization for standardization,
                headquartered in Berlin, and is the German ISO member body.
            </p>
            <p>
              DIN publishes a number of transliteration systems that converts
              non-Latin scripts into a form suitable for the German-speaking
              populace. DIN transliteration systems are mandated for use in
              German organizations that rely on bibliographic information, such
              as in German national libraries.
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

            <ExamplePage samples={samples} authority="DIN" />
        </>
    );
};
