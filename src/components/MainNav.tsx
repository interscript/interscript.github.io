import { SectionNav } from "components/SectionNav";
import { Link } from "@reach/router";
import { SectionNavAnchorItem, SectionNavItem } from "components/SectionNavItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "@reach/router";

const MAIN_MENU_ITEMS = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Featured authorities",
    path: "/featured-authorities",
  },
  {
    name: "Systems",
    path: "/systems",
  },
  {
    name: "Integrate",
    path: "/integrate",
  },
  {
    name: "Develop",
    path: "/develop",
  },
  {
    name: "Blog",
    path: "/blog",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Convert using API",
    path: "/try-api",
  },
  {
    name: "Convert using JS",
    path: "/try-js",
  },
  {
    name: "Detect systems",
    path: "/detect",
  },
  {
    name: "Diacriticize scripts",
    path: "/rababa",
  },
  {
    name: "Source on GitHub",
    path: "https://github.com/interscript/interscript/",
      external: true,
  },
];

export const MainNav = () => {
    const [currentMenu, setCurrentMenu] = useState(MAIN_MENU_ITEMS[0].path);
    const location = useLocation();

    useEffect(() => {
        setCurrentMenu(location.pathname);
    }, []);

    const mainMenuItems = MAIN_MENU_ITEMS.map((item) =>
        !item.external ? (
            <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                    setCurrentMenu(item.path);
                }}
            >
                {item.path === currentMenu ? (
                    <MainNavItem>
                        <strong>{item.name}</strong>
                    </MainNavItem>
                ) : (
                    <MainNavItem>{item.name}</MainNavItem>
                )}
            </Link>
        ) : (
            <MainNavAnchorItem key={item.path} href={item.path}>
                {item.name}
            </MainNavAnchorItem>
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
