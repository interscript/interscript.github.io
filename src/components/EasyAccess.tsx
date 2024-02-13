import React from "react";
import styled from "styled-components";
import { SectionNav } from "components/SectionNav";
import { SectionNavAnchorItem } from "components/SectionNavItem";
import { Link } from "@reach/router";

export default () => {
    return (
        <>
            <EasyAccessWrapper>
                <EasyAccessNav>
                    <span>
                        <strong>
                            <Link to={"/"}>Try Interscript!</Link>
                        </strong>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <EasyAccessNavItem key="convert" href="/demo#convert">
                        Convert
                    </EasyAccessNavItem>
                    <EasyAccessNavItem key="detect-script" href="/demo#detect-script">
                        Detect Systems
                    </EasyAccessNavItem>
                    <EasyAccessNavItem key="rababa" href="/demo#rababa">
                        Diacritize scripts
                    </EasyAccessNavItem>
                </EasyAccessNav>
            </EasyAccessWrapper>
        </>
    );
};

const EasyAccessWrapper = styled.div`
    display: flex;
    border: 3px solid #3e7e75;
    @media screen and (min-width: 1200px) {
        margin-left: 6.25rem;
        min-width: 550px;
    }

    @media screen and (max-width: 1200px) {
        display: none;
    }

    a {
        color: black;
    }
`;

const EasyAccessNav = styled(SectionNav)`
    text-align: justify;
    margin-top: 1rem;
    a:first-of-type {
        &::before {
            content: "";
            display: inline;
            margin: 0 1em 0 0;
        }
    }
`;

const EasyAccessNavItem = styled(SectionNavAnchorItem)`
    @media screen and (min-width: 900px) {
        &::before {
            content: "|";
            display: inline;
            margin: 0 1em 0 0;
        }
    }
`;
