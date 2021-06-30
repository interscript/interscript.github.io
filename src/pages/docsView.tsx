import React from "react";
import { useRouteData } from "react-static";
import Nav from "../pages/docs";
import styled from "styled-components";
import { SectionNav } from "../components/SectionNav";
import { SectionNavItem } from "../components/SectionNavItem";
import { Link } from "@reach/router";

const Wrapper = styled.div`
    margin-top: 32px;
`
export default () => {
  const { html, docsList } = useRouteData();

  return (
    <>
      <SectionNav>
        {docsList.map((doc: { label: string, template: string, link: string }, idx: number) => (
          <Link to={`/docs/${doc.link}`} key={idx}>
            <SectionNavItem key='docs'>
              <strong>{doc.label}</strong>
            </SectionNavItem>
          </Link>
        ))}
      </SectionNav>
      <Wrapper dangerouslySetInnerHTML={{ __html: html }}></Wrapper>
    </>
  );
};
