import { getLanguageTitleFrom6393BorT } from "components/isoLang";
import React, { useEffect, useState } from "react";
import { useRouteData } from "react-static";
import styled from "styled-components";
import { ReadmeSection, RepoInfo } from "types";
import { HeaderHashlinksMenu } from "../components/HeaderHashlinksMenu";
import { HeaderMenu } from "../components/HeaderMenu";
import LiveDemo from "../components/LiveDemo";
import { Section, SectionGrid } from "../components/Section";

// const API_ENDPOINT = "https://api.interscript.com";

export default () => {
    const { readmeSections, mapsInfo, subpages }: { readmeSections: ReadmeSection[]; repoInfo: RepoInfo; mapsInfo: any, subpages: any[] } =
        useRouteData();

    const [showDemo, setShowDemo] = useState(true);
    const [demoIsShowable, setDemoIsShowable] = useState(true);

    useEffect(() => {
        if (document.getElementById(window.location.hash.replace("#", ""))) {
            document.getElementById(window.location.hash.replace("#", "")).scrollIntoView();
        }
    }, []);

    const summary = Object.keys(mapsInfo.languages)
        .map((alpha3) => `${getLanguageTitleFrom6393BorT(alpha3)} (${mapsInfo.languages[alpha3]})`)
        .sort()
        .join(", ");

    return (
        <>
            <HeaderHashlinksMenu subpages={subpages} anchors={[]} />


            <SectionGrid>
                {readmeSections.map((section) => (
                    <Section key={section.id} id={section.id} dangerouslySetInnerHTML={{ __html: section.html }} />
                ))}
            </SectionGrid>

            <SectionGrid>
                <Section>
                    <div id="statistics">
                        <h2>{`Statistics`}</h2>
                        <p>{summary}</p>
                    </div>
                </Section>
            </SectionGrid>

            <SectionGrid>
                <Section>
                    <h2>{`Copyright`}</h2>
                    <p>{`Ribose© 2020. All rights reserved.`}</p>
                </Section>
            </SectionGrid>
        </>
    );
};
