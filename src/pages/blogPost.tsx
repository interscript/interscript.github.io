import React from "react";
import { useRouteData } from "react-static";
import styled from "styled-components";
import { SectionNav } from "../components/SectionNav";
import { Link } from "@reach/router";
import { SectionNavItem } from "../components/SectionNavItem";
import { DocFile } from "types/index";
import { AdocStyleWrapper } from "components/AdocStyleWrapper";

export default () => {
    const { blogList, html } = useRouteData();

    return (
        <>
            <SectionNav>
                {blogList &&
                    blogList.map((doc: DocFile, idx: number) => (
                        <Link to={`/blog/${doc.name}`} key={idx}>
                            <SectionNavItem key="docs">
                                <strong>{doc.title}</strong>
                            </SectionNavItem>
                        </Link>
                    ))}
            </SectionNav>
            <AdocStyleWrapper dangerouslySetInnerHTML={{ __html: html }} />
        </>
    );
};
