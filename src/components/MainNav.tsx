import { SectionNav } from "components/SectionNav";
import { Link } from "@reach/router";
import { SectionNavAnchorItem, SectionNavItem } from "components/SectionNavItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "@reach/router";

// @ts-ignore
import MAIN_MENU_ITEMS from "../routes";

export const MainNav = () => {
    const [currentMenu, setCurrentMenu] = useState(MAIN_MENU_ITEMS[0].path);
    const location = useLocation();

    useEffect(() => {
        setCurrentMenu(location.pathname);
    }, []);

    const mainMenuItems = MAIN_MENU_ITEMS.map((item: any) =>
        !item.external ? (
            <MainNavItem key={item.path}>
                <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                        setCurrentMenu(item.path);
                    }}
                >
                    {item.path === currentMenu ? <strong>{item.name}</strong> : item.name}
                </Link>
            </MainNavItem>
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

export const MainNavWrapper = styled(SectionNav)`
    > span:first-child {
        &::before {
            content: "";
            display: inline;
            margin: 0 1em 0 0;
        }
    }
`;
