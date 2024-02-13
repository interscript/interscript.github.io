import React, { ChangeEvent, useState } from "react";
import { useRouteData } from "react-static";
import { ReadmeSection } from "../../types";
import { HeaderHashlinksMenu } from "./HeaderHashlinksMenu";
import { Section, SectionGrid } from "./Section";
export default () => {
    const { sections } = useRouteData();
    const [selected, setSelected] = useState("0");

    return (
        <>
            <HeaderHashlinksMenu
                subpages={[]}
                showHome={true}
                anchors={sections[selected].map((item: any) => {
                    return {
                        path: item.id,
                        name: item.titleHTML,
                    };
                })}
            />
            <SectionGrid>
                <p>
                    Interscript supports a number of programming languages. From the dropdown box select the one you are
                    interested in.
                </p>
                <p>
                    <label>Programming Language:</label>&nbsp;
                    <select
                        onChange={(evt: ChangeEvent<HTMLSelectElement>) => {
                            setSelected(evt.target.value);
                        }}
                    >
                        <option value="0" defaultChecked={true}>
                            ruby
                        </option>
                        <option value="1">javascript</option>
                        <option value="2">python</option>
                        <option value="3">webapi</option>
                    </select>
                </p>
            </SectionGrid>
            {selected === "0" && (
                <SectionGrid>
                    {sections[0].map((section: ReadmeSection) => {
                        return (
                            <Section
                                key={section.id}
                                id={section.id}
                                dangerouslySetInnerHTML={{ __html: section.html }}
                            />
                        );
                    })}
                </SectionGrid>
            )}
            {selected === "1" && (
                <SectionGrid>
                    {sections[1].map((section: ReadmeSection) => {
                        return (
                            <Section
                                key={section.id}
                                id={section.id}
                                dangerouslySetInnerHTML={{ __html: section.html }}
                            />
                        );
                    })}
                </SectionGrid>
            )}
            {selected === "2" && <SectionGrid>Coming soon!</SectionGrid>}
            {selected === "3" && <SectionGrid>Coming soon!</SectionGrid>}
        </>
    );
};
