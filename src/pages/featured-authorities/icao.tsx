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
            <h2>{`International Civil Aviation Organization`}</h2>
            <p>
                The International Civil Aviation Organization (ICAO) is a specialized and funding agency of the United
                Nations. It changes the principles and techniques of international air navigation and fosters the
                planning and development of international air transport to ensure safe and orderly growth.[2] Its
                headquarters is located in the Quartier International of Montreal, Quebec, Canada.
            </p>
            <ExamplePage samples={samples} authority="ICAO" />
        </>
    );
};
