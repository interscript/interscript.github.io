import React from "react";
import { useRouteData } from "react-static";
import { ReadmeSection } from "../../types";
import { HeaderHashlinksMenu } from "./HeaderHashlinksMenu";
import { Section, SectionGrid } from "./Section";
export default () => {
    const { sections } = useRouteData();
    return (
        <>
            <HeaderHashlinksMenu
                subpages={[]}
                showHome={true}
                anchors={sections.map((item: any) => {
                    return {
                        path: item.id,
                        name: item.titleHTML,
                    };
                })}
            />
            <SectionGrid>
                {sections.map((section: ReadmeSection) => {
                    return (
                        <Section key={section.id} id={section.id} dangerouslySetInnerHTML={{ __html: section.html }} />
                    );
                })}
            </SectionGrid>
        </>
    );
};
