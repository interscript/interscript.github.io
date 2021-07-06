import React from "react";
import { useRouteData } from "react-static";
import styled from "styled-components";
import { SectionNav } from "../components/SectionNav";
import { SectionNavItem } from "../components/SectionNavItem";
import { Link } from "@reach/router";
import { DocFile } from "types/index";
import { AdocStyleWrapper } from "components/AdocStyleWrapper";

export default () => {
    const { html, docList } = useRouteData();
    const links = (docList || []).map((doc: DocFile, idx: number) => (
        <Link to={`/docs/${doc.name}`} key={idx}>
            <SectionNavItem key="docs">
                <strong>{doc.title}</strong>
            </SectionNavItem>
        </Link>
    ));

    return (
        <>
            <SectionNav>{docList && links}</SectionNav>
            <AdocStyleWrapper dangerouslySetInnerHTML={{ __html: html }} />
        </>
    );
};
