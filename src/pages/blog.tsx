import { Link } from '@reach/router';
import { CardBody, Footer, H3, Tile, TilesContainer } from 'components/Tiles';
import React, { useMemo } from 'react';
import { useRouteData } from 'react-static';
import { DocFile } from "types/index";

export default () => {
    const { blogList } = useRouteData();
    const list = useMemo(() => (blogList || []).map((doc: DocFile, idx: number) => (
      <Link to={`/blog/${doc.name}`} key={idx}>
        <Tile>
          <CardBody>
            <header><H3 className="title-h">{doc.title}</H3></header>
          </CardBody>
          <Footer>
            <span>Created: <b>{new Date().toDateString()}</b></span>
          </Footer>
        </Tile>
      </Link>
    )), [JSON.stringify(blogList)]);

    return (
        <>
            <TilesContainer>
                {blogList && list}
            </TilesContainer>
        </>
    )
}
