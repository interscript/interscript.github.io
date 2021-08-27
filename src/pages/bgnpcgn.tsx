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
            <h2>{`BGN/PCGN Romanization systems`}</h2>
            <p>
              The <a href="https://www.usgs.gov/core-science-systems/ngp/board-on-geographic-names">U.S. Board on Geographic Names</a>
              {` and the `}
              <a href="https://www.gov.uk/government/groups/the-permanent-committee-on-geographical-names">Permanent Committee on Geographical Names</a>
              {` jointly maintain the set of `}
              "<a href="https://www.gov.uk/government/publications/romanization-systems">BGN/PCGN   romanization systems</a>",
              a set of script conversion systems widely relied upon for
              geographic name script conversions.
            </p>
            <p>
              Systems listed here are ordered according to the "Introduction to Romanization Systems and Roman
              script spelling conventions (updated 25 September 2020)" document, available at{" "}
              <a href="https://geonames.nga.mil/gns/html/romanization.html" target="_blank">
                  BGN{" "}
              </a>
              and{" "}
              <a href="https://www.gov.uk/government/publications/romanization-systems" target="_blank">
                  PCGN
              </a>
              .
            </p>
            <p>
                <i>
                  NOTE: The title of a language or a writing system is followed by a note on the Romanization system used.
                </i>
            </p>
            <ExamplePage samples={samples} aggregate={true} authority="BGN/PCGN" />
        </>
    );
};
