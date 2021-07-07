import { Link } from "@reach/router";
import React from "react";
import { SectionNav } from "./SectionNav";
import { SectionNavItem } from "./SectionNavItem";

export function HeaderMenu() {
    return (
        <>
            <SectionNav>
                <Link to="/">
                    <SectionNavItem key="home">Home</SectionNavItem>
                </Link>
            </SectionNav>
        </>
    );
}
