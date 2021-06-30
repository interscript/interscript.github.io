import { Link } from "@reach/router";
import React from "react";
import { useRouteData } from "react-static";
import { SectionNav } from "../components/SectionNav";
import { SectionNavItem } from "../components/SectionNavItem";

export default (props: { docsList?: Array<{ label: string, template: string, link: string}> }) => {
    let { docsList } = props;
    if (!docsList) {
        docsList =  useRouteData().docsList;
    }
    // map docsList.tsx
    return (
        <>
            <SectionNav>
                {docsList.map((doc: { label: string, template: string, link: string}, idx: number) => (
                    <Link to={`/docs/${doc.link}`} key={idx}>
                        <SectionNavItem>
                            <strong>{doc.label}</strong>
                        </SectionNavItem>
                    </Link>
                ))}
            </SectionNav>
        </>
    )
}
