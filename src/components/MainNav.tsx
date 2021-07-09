import { SectionNav } from "components/SectionNav";
import { Link } from "@reach/router";
import { SectionNavAnchorItem, SectionNavItem } from "components/SectionNavItem";
import React from "react";
import styled from "styled-components";

const MAIN_MENU_ITEMS = [
    {
        name: "Home",
        path: "/",
    },
    {
        name: "Featured Authorities",
        path: "/featured-authorities",
    },
    {
        name: "Try: API",
        path: "/try-api",
    },
    {
        name: "Try: JavaScript",
        path: "/try-javascript",
    },
    {
        name: "Systems",
        path: "/systems",
    },
    {
        name: "Integration",
        path: "/integration",
    },
    {
        name: "Customizing and Contributing",
        path: "/customizing-and-contributing",
    },
    {
        name: "About",
        path: "/about",
    },
    {
        name: "Blog",
        path: "/blog",
    },
    {
        name: "View on Github",
        path: "https://github.com/interscript/interscript/",
        external: true,
    },
];

export const MainNav = () => {
    const mainMenuItems = MAIN_MENU_ITEMS.map((item, index) =>
        !item.external ? (
            <Link key={`${index}--${item.name}`} to={item.path}>
                <MainNavItem>{item.name}</MainNavItem>
            </Link>
        ) : (
            <MainNavAnchorItem href={item.path}>{item.name}</MainNavAnchorItem>
        )
    );

    return <MainNavWrapper>{mainMenuItems}</MainNavWrapper>;
};

export const MainNavItem = styled(SectionNavItem)`
    @media screen and (min-width: 900px) {
        &::before {
            content: "|";
            display: inline;
            margin: 0 1em 0 0;
        }
    }
`;

export const MainNavAnchorItem = styled(SectionNavAnchorItem)`
    @media screen and (min-width: 900px) {
        &::before {
            content: "|";
            display: inline;
            margin: 0 1em 0 0;
        }
    }
`;

export const MainNavWrapper = styled(SectionNav)``;
