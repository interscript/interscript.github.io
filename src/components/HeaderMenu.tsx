import { Link } from "@reach/router";
import React from "react";
import { SectionNav } from "./SectionNav";
import styled from "styled-components";

export function HeaderMenu() {
    return (
        <HeadMenu>
            <SectionNav>
                <Link to="/">
                    <span>&laquo; Home</span>
                </Link>
            </SectionNav>
        </HeadMenu>
    );
}

const HeadMenu = styled.section`
    margin-bottom: 24px;
`;