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
            <h2>{`ISO written language conversion systems`}</h2>
            <p>
              The
              <a href="https://www.iso.org">International Organization for Standardization</a> (ISO)
              is an international standardization body that develops and publishes
              International Standards.
            </p>
            <p>
              Specifically, the <a href="https://www.iso.org/committee/48750.html">ISO/TC 46</a>
              WG 3 "Conversion of written languages" develops standards for
              written language conversion systems, which include transliteration
              and transcription systems.
            </p>
            <p>
              Transliteration and transcription systems standardized by ISO are
              often used in international contexts.
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

            <ExamplePage samples={samples} authority="ISO" />
        </>
    );
};
