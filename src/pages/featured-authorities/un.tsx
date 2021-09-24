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

            <h2>{`United Nations official Romanization systems`}</h2>
            <p>
                The <a href="https://www.eki.ee/wgrs/">Working Group on Romanization Systems (WGRS)</a> of the{" "}
                <a href="https://unstats.un.org/unsd/ungegn/">
                    United Nations Group of Experts on Geographical Names (UNGEGN)
                </a>
                , under the <a href="https://unstats.un.org">United Nations Statistics Division (UNSD)</a>,
                {` maintains a set of `}
                <a href="https://www.eki.ee/wgrs/status.htm">Romanization systems</a>: an official list of authorized
                systems by the United Nations for the purpose of geographic names script conversion.
            </p>
            <p>
                WGRS maintains a list of 30 official Romanization systems ("Languages/scripts covered by systems
                recommended by the United Nations") with 15 unofficial ones ("Other languages/scripts").
            </p>
            <p>
                The systems listed here are ordered according to the{" "}
                <a
                    href="https://unstats.un.org/unsd/geoinfo/UNGEGN/docs/10th-uncsgn-docs/Exhibition%20posters/WG%20on%20Romanization_4.pdf"
                    target="_blank"
                >
                    Romanization examples exhibition poster
                </a>{" "}
                at the{" "}
                <a href="https://unstats.un.org/unsd/geoinfo/UNGEGN/ungegnConf10.html">
                    10th United Nations Conference on the Standardization of Geographical Names (UNCSGN)
                </a>
                , prepared by the WGRS.
            </p>
            <p>
                <i>
                    NOTE: The title of a language or a writing system is followed by a note on the Romanization system
                    used.
                </i>
            </p>
            <ExamplePage samples={samples} />
        </>
    );
};
