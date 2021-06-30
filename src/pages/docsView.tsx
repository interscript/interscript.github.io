import React from "react";
import { useRouteData } from "react-static";
import Nav from "../pages/docs";
import styled from "styled-components";

const Wrapper = styled.div`
    margin-top: 32px;
`
export default () => {
  const { html, docsList } = useRouteData();

  return (
    <>
      <Nav docsList={docsList} />
      <Wrapper dangerouslySetInnerHTML={{ __html: html }}></Wrapper>
    </>
  );
};
