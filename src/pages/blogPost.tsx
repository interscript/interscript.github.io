import React from 'react';
import { useRouteData } from 'react-static';
import styled from 'styled-components';
import { SectionNav } from '../components/SectionNav';
import { Link } from '@reach/router';
import { SectionNavItem } from '../components/SectionNavItem';

const Wrapper = styled.div`
    margin-top: 32px;
`

export default () => {
    const { blogList, html } = useRouteData();

    return (
        <>
            <SectionNav>
                {blogList.map((doc: { label: string, template: string, link: string }, idx: number) => (
                    <Link to={`/blog/${doc.link}`} key={idx}>
                        <SectionNavItem key="docs">
                            <strong>{doc.label}</strong>
                        </SectionNavItem>
                    </Link>
                ))}
            </SectionNav>
            <Wrapper dangerouslySetInnerHTML={{ __html: html }}></Wrapper>
        </>)
}
