import { Link } from "@reach/router";
import { CardBody, Footer, H3, Tile, TilesContainer, Paragraph } from "components/Tiles";
import React, { useMemo } from "react";
import { useRouteData } from "react-static";
import { PostInfo } from "types/index";

export default () => {
    const { blogList } = useRouteData();
    const list = useMemo(
        () =>
            (blogList || []).map((post: PostInfo, idx: number) => (
                <Link to={`/blog/${post.name}`} key={idx}>
                    <Tile>
                        <CardBody>
                            <header>
                                <H3 className="title-h">{post.title}</H3>
                            </header>
                        </CardBody>
                        <Footer>
                            <Paragraph>
                                <span>
                                    Created: <b>{new Date(post.date).toDateString()}</b>
                                </span>
                                <br />
                                <span>
                                    Author: <b>{post.author}</b>
                                </span>
                            </Paragraph>
                        </Footer>
                    </Tile>
                </Link>
            )),
        [JSON.stringify(blogList)]
    );

    return (
        <>
            <TilesContainer>{blogList && list}</TilesContainer>
        </>
    );
};
