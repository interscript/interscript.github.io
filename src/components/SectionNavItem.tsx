import styled from "styled-components";

export const SectionNavItem = styled.span`
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
            content: "•";
            display: inline;
            margin: 0 1em 0 0;
        }
    }
`;

export const SectionNavAnchorItem = styled.a`
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
            content: "•";
            display: inline;
            margin: 0 1em 0 0;
        }
    }
`;
