import { Link } from "@reach/router";
import React from "react";
import { useRouteData } from "react-static";
import { CardBody, Tile, TilesContainer } from "../components/Tiles";

export default (props: { docsList?: Array<{ label: string, template: string, link: string }> }) => {
    let { docsList } = props;
    if (!docsList) {
        docsList = useRouteData().docsList;
    }
    // map docsList.tsx
    return (
        <>
            <TilesContainer>
                {docsList.map((doc: { label: string, template: string, link: string }, idx: number) => (
                    <Link to={`/docs/${doc.link}`} key={idx}>
                        <Tile>
                            <CardBody>
                                <header><h3>{doc.label}</h3></header>
                            </CardBody>
                        </Tile>
                    </Link>
                ))}
            </TilesContainer>
        </>
    )
}
