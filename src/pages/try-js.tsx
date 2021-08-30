import React, { useState, useEffect } from "react";
import { useRouteData } from "react-static";
import { HeaderMenu } from "components/HeaderMenu";
import { InterscriptMetaDataMap } from "../meta";
import { Section, SectionGrid } from "components/Section";
import LiveDemo from "components/LiveDemo";

export default () => {
    const {
        mapsInfo,
        metaDataMap,
    }: {
        mapsInfo: any;
        metaDataMap: InterscriptMetaDataMap;
    } = useRouteData();

    const [demoIsShowable, setDemoIsShowable] = useState(false);

    useEffect(() => {
        // Ensures interactive elements are not included in static HTML
        setDemoIsShowable(true);
    }, []);

    return (
        <>
            <HeaderMenu />
            <SectionGrid>
                <Section>
                  <p>{`Interscript provides ${mapsInfo?.meta.total} script conversion systems in JavaScript through `}
                  <a href="https://github.com/interscript/interscript-js">interscript.js</a>
                  {"."}
                  </p>
                </Section>
            </SectionGrid>

            <SectionGrid>
                {demoIsShowable ? (
                    <Section>
                        <h3>Try it live - interscript.js</h3>
                        <LiveDemo maps={mapsInfo.data} metaData={metaDataMap} />
                    </Section>
                ) : null}
            </SectionGrid>
        </>
    );
};
