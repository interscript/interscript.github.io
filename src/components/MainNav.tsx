import { SectionNav } from "components/SectionNav";
import { Link } from "@reach/router";
import { SectionNavAnchorItem, SectionNavItem } from "components/SectionNavItem";
import React from "react";

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
                <SectionNavItem>{item.name}</SectionNavItem>
            </Link>
        ) : (
            <SectionNavAnchorItem href={item.path}>{item.name}</SectionNavAnchorItem>
        )
    );

    return <SectionNav>{mainMenuItems}</SectionNav>;
};
