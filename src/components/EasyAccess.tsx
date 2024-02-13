import React from "react";
import styled from "styled-components";
import { SectionNav } from "components/SectionNav";
import { SectionNavAnchorItem } from "components/SectionNavItem";

export default () => {
    return (
        <>
            <EasyAccessWrapper>
                <EasyAccessNav>
                    <span>
                        <strong>Try it in a Browser</strong>!&nbsp;&nbsp;&nbsp;&nbsp;
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
    margin-left: 6.25rem;
    min-width: 550px;
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
