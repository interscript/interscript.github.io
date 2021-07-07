import { Link } from "@reach/router";
import React from "react";
import { SectionNav } from "./SectionNav";
import { SectionNavAnchorItem, SectionNavItem } from "./SectionNavItem";

export interface Hashlink {
    name: string;
    path: string;
}


export function HeaderHashlinksMenu({ anchors, subpages }: { anchors: Hashlink[], subpages: Hashlink[] }) {
    return (
        <SectionNav>
            {
                anchors.map((item, index) => (
                    <SectionNavAnchorItem href={`#${item.path}`}><strong>{item.name}</strong>
                    </SectionNavAnchorItem>
                ))
            }
            {
                subpages.map((page) => {
                    return (
                        page.path.includes('https') ? (
                            <a href={page.path}><SectionNavItem>{page.name}</SectionNavItem></a>
                        ) : (
                            <Link key={page.path} to={`/${page.path}`}>
                                <SectionNavItem>{page.name}</SectionNavItem>
                            </Link>
                        )
                    )
                }

                )
            }
        </SectionNav>
    )
}