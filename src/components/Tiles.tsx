import styled from 'styled-components';

export const TilesContainer = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    margin-top: 30px;
`

export const Tile = styled.a`
    color: inherit;
    text-decoration: none;
    box-sizing: border-box;
    flex-basis: calc( 100%/2 - 15px);
    margin-bottom: 15px;
    box-shadow: 0px 4px 12px rgb(0 0 0 / 8%);
    transition: box-shadow .17s ease, transform .17s ease;
    padding: 30px 30px 16px 30px;
    position: relative;
    background: white;
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    margin-right: 15px;
`

export const CardBody = styled.div`
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
`
export const Paragraph = styled.div`
    flex: 1;
    font-size: 15px;
`
export const Footer = styled.div`
    margin-top: 14px;
    color: grey;
    font-size: 14px;
`
