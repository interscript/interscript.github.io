import React, { useEffect, useState } from "react";
import { useRouteData } from "react-static";
import { ReadmeSection, RepoInfo } from "types";
import { HeaderHashlinksMenu } from "../components/HeaderHashlinksMenu";
import { Section, SectionGrid } from "../components/Section";
import { Statistics } from "../components/Statistics";
// const API_ENDPOINT = "https://api.interscript.com";

export default () => {
    const {
        readmeSections,
        mapsInfo,
    }: { readmeSections: ReadmeSection[]; repoInfo: RepoInfo; mapsInfo: any } = useRouteData();

    useEffect(() => {
        if (document.getElementById(window.location.hash.replace("#", ""))) {
            document.getElementById(window.location.hash.replace("#", "")).scrollIntoView();
        }
    }, []);

    return (
        <>
            <HeaderHashlinksMenu
                subpages={[]}
                anchors={[
                    {
                        name: "Introduction",
                        path: readmeSections.find((x) => x.id === "introduction").id,
                    },
                    {
                        name: "Demonstration",
                        path: readmeSections.find((x) => x.id === "demonstration").id,
                    },
                    {
                        name: "Statistics",
                        path: "statistics",
                    },
                ]}
            />

            <SectionGrid>
                {readmeSections.map((section) => (
                    <Section key={section.id} id={section.id} dangerouslySetInnerHTML={{ __html: section.html }} />
                ))}
            </SectionGrid>

            <SectionGrid>
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
