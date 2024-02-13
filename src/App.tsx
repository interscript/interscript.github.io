import React, { useState } from "react";
import { Root, Routes } from "react-static";
import { Router } from "@reach/router";
import { Helmet } from "react-helmet";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import styled, { createGlobalStyle } from "styled-components";
import logo from "assets/symbol.svg";
import { MainNav } from "components/MainNav";
import EasyAccess from "components/EasyAccess";

export const primaryColor = "008075";

const GlobalStyle = createGlobalStyle`
  * {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'HelveticaNeue-Regular', 'Helvetica Neue Regular', 'Helvetica Neue',
    Helvetica, 'Lucida Grande', Arial, sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.4;

    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: #${primaryColor};
  }
`;

function App() {
    return (
        <Root>
            <GlobalStyle />

            <Helmet>
                <title>Interscript: Interoperable script conversion systems</title>
                <meta charSet="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            <LogoHeader>
                <HeaderCenter>
                    <LogoSection>
                        <LogoWrapper>
                            <LogoSymbol src={logo} alt="is" />
                        </LogoWrapper>
                        <HeaderTitle />
                    </LogoSection>
                    <EasyAccessSection>
                        <EasyAccess />
                    </EasyAccessSection>
                </HeaderCenter>
            </LogoHeader>

            <MainNavSection>
                <MainNav />
            </MainNavSection>
            <MainContent>
                <React.Suspense fallback={<em>Loading...</em>}>
                    <Router>
                        <Routes path="*" />
                    </Router>
                </React.Suspense>
            </MainContent>
        </Root>
    );
}

const HeaderTitle: React.FC<{}> = function () {
    const [showCompact, setShowCompact] = useState(false);

    useScrollPosition(({ currPos }) => {
        const logoHeight = 140;
        const headerPadding = 20;
        setShowCompact(currPos.y < 0 - logoHeight + headerPadding);
    });

    return (
        <>
            <ProjectTitleLarge>
                <h1 className="title">
                    <b>Inter</b>script
                </h1>
                <p className="tagline">
                    Interoperable
                    <br />
                    script&nbsp;conversion&nbsp;systems
                </p>
            </ProjectTitleLarge>

            {showCompact ? (
                <ProjectTitleSmallWithLogo role="presentation">
                    <EasyAccess />
                    <h1 className="title">
                        <b>Inter</b>script
                    </h1>
                    <LogoSymbolSmall src={logo} role="presentation" />
                    <p className="tagline">
                        Interoperable
                        <br />
                        script&nbsp;conversion&nbsp;systems
                    </p>
                </ProjectTitleSmallWithLogo>
            ) : null}
        </>
    );
};

const LogoHeader = styled.header`
    display: flex;
    align-items: center;
    flex-flow: column nowrap;
    z-index: 2;
`;

const HeaderCenter = styled.div`
    display: flex;
    flex-flow: row;
`;

const LogoSection = styled.div`
    display: flex;
    flex-flow: column nowrap;
`;

const LogoWrapper = styled.div`
    display: flex;
    flex-flow: row-reverse;
`;

const EasyAccessSection = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
`;

const LogoSymbol = styled.img`
    height: 100px;
    width: 100px;
    margin: 20px;
`;

const LogoSymbolSmall = styled(LogoSymbol)`
    height: 50px;
    width: 50px;
    margin: 0;
`;

const ProjectTitle = styled.div`
    display: flex;
    align-items: center;

    .title {
        font-size: 42px;
        line-height: 1;

        font-family: "HelveticaNeue-Thin", "Helvetica Neue Thin", "Helvetica Neue", Helvetica, Arial, "Lucida Grande",
            sans-serif;
        font-weight: 200;

        b {
            font-family: "HelveticaNeue-Bold", "Helvetica Neue Bold", "Helvetica Neue", Helvetica, Arial,
                "Lucida Grande", sans-serif;
            font-weight: 700;
        }
    }
`;

const ProjectTitleLarge = styled(ProjectTitle)`
    flex-flow: column nowrap;

    .tagline,
    .title {
        text-align: center;
        margin: 0;
        padding: 0;
        letter-spacing: -0.02em;
    }

    .tagline {
        margin-top: 0.5em;
        line-height: 1.1;
    }

    @media screen and (min-width: 900px) {
        flex-flow: row-reverse nowrap;

        .tagline {
            text-align: right;
            margin: 0;
            margin-right: 0.5rem;
        }

        .title {
            text-align: left;
            margin: 0;
            margin-left: 0.5rem;
        }
    }
`;

const ProjectTitleSmallWithLogo = styled(ProjectTitle)`
    flex-flow: row-reverse nowrap;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 10px 1.5rem;

    box-shadow: rgba(0, 0, 0, 0.2) 0 10px 30px -10px;

    z-index: 3;

    .tagline {
        text-align: right;
        margin: 0;
        margin-right: 0.75rem;
        display: none;
    }

    .title {
        text-align: left;
        margin: 0;
        margin-left: 0.5rem;
    }

    @media screen and (min-width: 900px) {
        transform: scale(0.9);
        border-radius: 0.5rem;

        .tagline {
            display: block;
        }
    }
`;

const MainNavSection = styled.nav`
    @media screen and (min-width: 900px) {
        margin: 0 auto;
        width: 901px;
    }
`;
const MainContent = styled.main`
    ul {
        padding-left: 1.25em;
    }

    dd {
        margin-left: 1.25em;
    }

    @media screen and (min-width: 900px) {
        margin: 0 auto;
        width: 901px;
    }
`;

export default App;
