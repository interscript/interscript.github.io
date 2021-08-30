import React, { useEffect, useState } from "react";
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
                    <p>{`Interscript provides ${mapsInfo?.meta.total} script conversion systems via its Ruby API from`}
                    <a href="https://github.com/interscript/interscript-api">interscript-api</a>
                    </p>
                </Section>
            </SectionGrid>

            <SectionGrid>
                {demoIsShowable ? (
                    <Section>
                        <h2>Try it live - interscript in Ruby</h2>
                        <LiveDemo maps={mapsInfo.data} metaData={metaDataMap} demoType="RUBY" />
                    </Section>
                ) : null}
            </SectionGrid>
        </>
    );
};
