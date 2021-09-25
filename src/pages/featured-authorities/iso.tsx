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
            <h2>{`The International Organization for Standardization official Romanization systems`}</h2>
            {/*<p>TBD</p>*/}
            <ExamplePage samples={samples} authority="ISO" />
        </>
    );
};
