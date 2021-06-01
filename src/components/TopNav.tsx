import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";

export default () => (
  <TopNav>
    <Link to="/" className="nav-item">
      Home
    </Link>
    <Link to="/js" className="nav-item">
      Demo
    </Link>
    <Link to="/js/un" className="nav-item">
      UN
    </Link>
    <Link to="/js/bgnpcgn" className="nav-item">
      BGN/PCGN
    </Link>
    <Link to="/js/alalc" className="nav-item">
      ALA-LC
    </Link>
    <Link to="/js/odni" className="nav-item">
      ODNI
    </Link>
    <Link to="/js/ogc11122" className="nav-item">
      OGC 11-122r1
    </Link>
  </TopNav>
);

const TopNav = styled.nav`
  margin: 2rem 2rem 1rem 2rem;
  text-align: center;

  @media screen and (min-width: 900px) {
    text-align: center;
    margin: 2rem 0 1rem 1rem;
  }

  .nav-item {
    display: inline-block;
    margin-right: 1em;

    white-space: nowrap;

    &,
    &:link,
    &:visited {
      border-bottom: none;
    }

    @media screen and (min-width: 900px) {
      &::before {
        content: "|";
        display: inline;
        margin: 0 1em 0 0;
      }

      &:first-child::before {
        content: none;
      }
    }
  }
`;