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
            <h2>{`Deutsches Institut für Normung systems`}</h2>
            <p>
                <i>
                    <b>
                        <i lang="de" title="German-language text">
                            Deutsches Institut für Normung e.V.
                        </i>
                    </b>
                </i>{" "}
                (<b>DIN</b>; in English , the <b>German Institute for Standardisation</b>) is the German national
                organization for standardization and is the German ISO member body. DIN is a German Registered
                Association (<i>e.V.</i>) headquartered in Berlin.
            </p>
            <ExamplePage samples={samples} authority="DIN" />
        </>
    );
};
