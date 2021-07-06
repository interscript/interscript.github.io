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

            <h2>{`BGN/PCGN systems`}</h2>
            <p>
                <i>{`Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i>
            </p>
            <p>
                <i>
                    The systems listed here are ordered according to the "Introduction to Romanization Systems and Roman
                    script spelling conventions (updated 25 September 2020)" document, available at{" "}
                    <a href="https://geonames.nga.mil/gns/html/romanization.html" target="_blank">
                        BGN{" "}
                    </a>
                    and{" "}
                    <a href="https://www.gov.uk/government/publications/romanization-systems" target="_blank">
                        PCGN
                    </a>
                    .
                </i>
            </p>
            <ExamplePage samples={samples} aggregate={true} authority="BGN/PCGN" />
        </>
    );
};
