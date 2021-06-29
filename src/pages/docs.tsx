import { Link } from "@reach/router";
import React from "react";
import { useRouteData } from "react-static";
import { SectionNav } from "../components/SectionNav";
import { SectionNavItem } from "../components/SectionNavItem";

export default () => {
    const { docsList } = useRouteData();
    console.log(docsList);
    // map docsList.tsx
    return (
        <>
            <SectionNav>
                {docsList.map((doc: { label: string, template: string}, idx: number) => (
                    <Link to={`/docs/${doc.template}`} key={idx}>
                        <SectionNavItem>
                            <strong>{doc.label}</strong>
                        </SectionNavItem>
                    </Link>
                ))}
            </SectionNav>
        </>
    )
}
