import React, { useEffect, useState } from "react";
import { useRouteData } from "react-static";
import { InterscriptMetaDataMap, InterscriptMapsMetaInfo } from "../meta";
import { Section, SectionGrid } from "components/Section";
import { HeaderHashlinksMenu } from "components/HeaderHashlinksMenu";
import Convertor from "containers/convertor";
import DetectSystem from "components/DetectSystem";
import Rababa from "components/Rababa";

export default () => {
    const {
        mapsInfo,
        metaDataMap,
    }: {
        mapsInfo: InterscriptMapsMetaInfo;
        metaDataMap: InterscriptMetaDataMap;
    } = useRouteData();

    const [demoIsShowable, setDemoIsShowable] = useState(false);

    useEffect(() => {
        // Ensures interactive elements are not included in static HTML
        setDemoIsShowable(true);
    }, []);

    return (
        <>
            <HeaderHashlinksMenu
                showHome={true}
                subpages={[]}
                anchors={[
                    { name: "Convert", path: "convert" },
                    { name: "Detect Script", path: "detect-script" },
                    { name: "Rababa", path: "rababa" },
                ]}
            />
            <SectionGrid>
                {demoIsShowable ? (
                    <Section key="convert" id="convert">
                        <Convertor mapsInfo={mapsInfo} metaDataMap={metaDataMap} />
                    </Section>
                ) : null}
                <Section key="detect-script" id="detect-script">
                    <DetectSystem />
                </Section>
                <Section key="rababa" id="rababa">
                    <Rababa />
                    <p style={{ height: "20rem" }}></p>
                </Section>
            </SectionGrid>
        </>
    );
};
