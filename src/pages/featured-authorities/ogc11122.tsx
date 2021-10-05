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

            <h2>{`OGC Web Feature Service transliteration systems`}</h2>
            <p>
                The <a href="https://www.ogc.org/">Open Geospatial Consortium (OGC)</a>
                {" published "}
                <a href="https://portal.ogc.org/files/?artifact_id=46964">OGC Best Practice 11-122r1</a> "Gazetteer
                Service - Application Profile of the Web Feature Service". Its "Annex E: Transliteration domains"
                provides a list of script conversion systems that can be used with the Web Feature Service.
            </p>
            <p>
                <i>
                    Systems listed are ordered as represented in Annex E of the{" "}
                    <a href="https://www.ogc.org/standards/wfs" target="_blank">
                        OGC 11-122r1 Best Practice document
                    </a>
                    .
                </i>
            </p>
            <p>
              <i>
                NOTE: The title of a language or a writing system is followed by
                the corresponding OGC 11-122r1 code that describes the system.
              </i>
            </p>

            <ExamplePage samples={samples} />
        </>
    );
};
