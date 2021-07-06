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

            <h2>{`UN systems`}</h2>
            <p>
                <i>{`Each title of a language or a writing system is followed by a note on the appropriate romanization system used (UN = United Nations, BGN/PCGN = US Board on Geographic Names and Permanent Committee on Geographical Names for British Official Use)`}</i>
            </p>
            <p>
                <i>
                    The systems listed here are ordered according to the{" "}
                    <a
                        href="https://unstats.un.org/unsd/geoinfo/UNGEGN/docs/10th-uncsgn-docs/Exhibition%20posters/WG%20on%20Romanization_4.pdf"
                        target="_blank"
                    >
                        Romanization examples
                    </a>{" "}
                    exhibition poster at the 10th UNCSGN conference, from the UNGEGN Working Group on Romanization
                    Systems.
                </i>
            </p>
            <ExamplePage samples={samples} />
        </>
    );
};
