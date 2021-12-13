import React, { useEffect, useState } from "react";
import { useRouteData } from "react-static";
import { HeaderHashlinksMenu } from "../components/HeaderHashlinksMenu";
import { Section, SectionGrid } from "../components/Section";
import { Statistics } from "../components/Statistics";
// const API_ENDPOINT = "https://api.interscript.com";
// @ts-ignore
import MAIN_MENU_ITEMS from "../routes";
import { Link } from "@reach/router";
import { MainNavAnchorItem, MainNavItem } from "components/MainNav";

export default () => {
    const { mapsInfo }: { mapsInfo: any } = useRouteData();

    useEffect(() => {
        if (document.getElementById(window.location.hash.replace("#", ""))) {
            document.getElementById(window.location.hash.replace("#", "")).scrollIntoView();
        }
    }, []);

    const mainMenuItems = MAIN_MENU_ITEMS.map(
        (item: any) =>
            item.name !== "Home" &&
            (!item.external ? (
                <li key={item.path}>
                    <Link key={item.path} to={item.path}>
                        {item.name}
                    </Link>
                </li>
            ) : (
                <li key={item.path}>
                    <a key={item.path} href={item.path}>
                        {item.name}
                    </a>
                </li>
            ))
    );

    return (
        <>
            <SectionGrid>
                <Section>
                    <div id="introduction">
                        <h2>{`Introduction`}</h2>
                        <div dir="auto">
                            <div dir="auto">
                                <p dir="auto">Supports the following transliteration schemes:</p>
                            </div>
                            <div dir="auto">
                                <ul dir="auto">
                                    <li>
                                        <p dir="auto">ALA-LC</p>
                                    </li>
                                    <li>
                                        <p dir="auto">BGN/PCGN</p>
                                    </li>
                                    <li>
                                        <p dir="auto">ICAO</p>
                                    </li>
                                    <li>
                                        <p dir="auto">ISO</p>
                                    </li>
                                    <li>
                                        <p dir="auto">UN (by UNGEGN)</p>
                                    </li>
                                    <li>
                                        <p dir="auto">Many, many other script conversion system authorities.</p>
                                    </li>
                                </ul>
                            </div>
                            <div dir="auto">
                                <p dir="auto">
                                    The goal is to achieve interoperable transliteration schemes allowing quality
                                    comparisons.
                                </p>
                            </div>
                        </div>
                    </div>
                </Section>
                <Section>
                    <div id="pages">
                        <h2>{`Pages`}</h2>
                        <ul>{mainMenuItems}</ul>
                    </div>
                </Section>
                <Section>
                    <div id="statistics">
                        <h2>{`Statistics`}</h2>
                        <Statistics mapsInfo={mapsInfo} />
                    </div>
                </Section>
            </SectionGrid>

            <SectionGrid>
                <Section>
                    <h2>{`Copyright`}</h2>
                    <p>{`Ribose© 2018-2021. All rights reserved.`}</p>
                </Section>
            </SectionGrid>
        </>
    );
};
