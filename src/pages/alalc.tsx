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

            <h2>{`ALA-LC Romanization Tables`}</h2>
            <p>
              The <a href="https://www.ala.org">American Library Association</a>
              {` and the `} <a href="https://www.loc.gov">Library of Congress</a>
              {` jointly maintain the set of `}
              "<a href="https://www.loc.gov/catdir/cpso/roman.html">ALA-LC Romanization Tables</a>",
              a set of Romanization systems covering many languages.
              These systems are commonly used in libraries and bibliographic data
              worldwide.
            </p>
            <p>
              Systems listed here follow the same order in the presentation of
              the original
              <a href="https://www.loc.gov/catdir/cpso/roman.html" target="_blank">
                  {" "}
                  ALA-LC Romanization Tables{" "}
              </a>
              page.
            </p>
            <p>
                <i>
                  NOTE: The title of a language or a writing system is followed by a note on the Romanization system used.
                </i>
            </p>
            <ExamplePage samples={samples} aggregate={true} authority="ALA-LC" />
        </>
    );
};
