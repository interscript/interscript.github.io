import { Link } from '@reach/router';
import { CardBody, Footer, H3, Tile, TilesContainer } from 'components/Tiles';
import React from 'react';
import { useRouteData } from 'react-static';

export default () => {
    const { blogList } = useRouteData();
    return (
        <>
            <TilesContainer>
                {blogList.map((doc: { label: string, template: string, link: string, date: string, path: string }, idx: number) => (
                    <Link to={`/blog/${doc.link}`} key={idx}>
                        <Tile>
                            <CardBody>
                                <header><H3 className="title-h">{doc.label}</H3></header>
                            </CardBody>
                            <Footer>
                                <span>Created: <b>{doc.date}</b></span>
                            </Footer>
                        </Tile>
                    </Link>
                ))}
            </TilesContainer>
        </>
    )
}
