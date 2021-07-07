import { Link } from "@reach/router";
import React from "react";
import { SectionNav } from "./SectionNav";
import { SectionNavItem } from "./SectionNavItem";

export function HeaderMenu() {
    return (
        <>
            <SectionNav>
                <Link to="/">
                    <span>&laquo; Home</span>
                </Link>
            </SectionNav>
        </>
    );
}
