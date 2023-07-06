import React, { useEffect, useState } from "react";
import { useRouteData } from "react-static";
import { HeaderHashlinksMenu } from "../components/HeaderHashlinksMenu";
import { Section, SectionGrid } from "../components/Section";
import { Statistics } from "../components/Statistics";
import QuickBox from "components/QuickBox";
import { InterscriptMetaDataMap } from "../meta";
// const API_ENDPOINT = "https://api.interscript.com";

export default () => {
    const {
        mapsInfo,
        metaDataMap,
    }: {
        mapsInfo: any;
        metaDataMap: InterscriptMetaDataMap;
    } = useRouteData();

    useEffect(() => {
        if (document.getElementById(window.location.hash.replace("#", ""))) {
            document.getElementById(window.location.hash.replace("#", "")).scrollIntoView();
        }
    }, []);

    return (
        <>
            <SectionGrid>
                <p dir="auto">
                    Input text in the provided field for automatic detection of the most suitable transliteration map.
                    Click "Convert" to initiate the transliteration process.
                </p>
                <QuickBox maps={mapsInfo.data} metaData={metaDataMap} />
            </SectionGrid>
            <SectionGrid>
                <Section>
                    <div id="introduction">
                        <h2>{`Introduction`}</h2>
                        <div dir="auto">
                            <div dir="auto">
                                <p dir="auto">Supports the following transliteration schemes:</p>
                            </div>
                            <div dir="auto">
                                <ul dir="auto">
                                    <li>
                                        <p dir="auto">ALA-LC</p>
                                    </li>
                                    <li>
                                        <p dir="auto">BGN/PCGN</p>
                                    </li>
                                    <li>
                                        <p dir="auto">ICAO</p>
                                    </li>
                                    <li>
                                        <p dir="auto">ISO</p>
                                    </li>
                                    <li>
                                        <p dir="auto">UN (by UNGEGN)</p>
                                    </li>
                                    <li>
                                        <p dir="auto">Many, many other script conversion system authorities.</p>
                                    </li>
                                </ul>
                            </div>
                            <div dir="auto">
                                <p dir="auto">
                                    The goal is to achieve interoperable transliteration schemes allowing quality
                                    comparisons.
                                </p>
                            </div>
                        </div>
                    </div>
                </Section>
                <Section>
                    <div id="statistics">
                        <h2>{`Statistics`}</h2>
                        <Statistics mapsInfo={mapsInfo} />
                    </div>
                </Section>
            </SectionGrid>

            <SectionGrid>
                <Section>
                    <h2>{`Copyright`}</h2>
                    <p>{`Ribose© 2018-2021. All rights reserved.`}</p>
                </Section>
            </SectionGrid>
        </>
    );
};
