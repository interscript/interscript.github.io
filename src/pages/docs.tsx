import { Link } from "@reach/router";
import React, { useMemo } from "react";
import { useRouteData } from "react-static";
import { CardBody, Tile, TilesContainer } from "../components/Tiles";
import { DocFile } from "types/index";

export default () => {
    const { docList } = useRouteData();
    const children = useMemo(
        () =>
            (docList || []).map((doc: DocFile, idx: number) => (
                <Link to={`/customizing-and-contributing/${doc.name}`} key={idx}>
                    <Tile>
                        <CardBody>
                            <header>
                                <h3>{doc.title}</h3>
                            </header>
                        </CardBody>
                    </Tile>
                </Link>
            )),
        [JSON.stringify(docList)]
    );

    return (
        <>
            <TilesContainer>{children}</TilesContainer>
        </>
    );
};
