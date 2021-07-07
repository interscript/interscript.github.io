import React from "react"; 
import { useRouteData } from "react-static";
import { ReadmeSection } from "../../types";
import { AdocStyleWrapper } from "./AdocStyleWrapper";

export default () => {
    const { sections } = useRouteData();
    console.log(sections);

    return (
        <AdocStyleWrapper>
            {/* TODO: generated HeaderHashlinksMenu */}
            {
                sections.map((section: ReadmeSection) => {
                    // <div id={section.id} dangerouslySetInnerHTML={{ __html: `<div>${section.html}</div>` }}></div>
                })
            }
        </AdocStyleWrapper>
    )
        }