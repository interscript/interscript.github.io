import styled from "styled-components";
import { GITHUB_HIGHLIGHT_THEME } from "./GithubHightlightTheme";

export const Section = styled.article`
    a.anchor {
        margin-right: 0.5rem;

        &,
        &:link,
        &:visited {
            border: none;
        }
    }

    a[rel*="noopener"] {
        &,
        &:link,
        &:visited {
            border: none;
        }
    }
`;

export const SectionGrid = styled.div`
    overflow: hidden;
    padding: 0 1rem;

    pre,
    code {
        font-size: 14px;
        background: whiteSmoke;
        font-family: "Iosevka Term SS01", "Iosevka Term", Iosevka, system-ui-monospaced, Menlo, "Courier New", monospace;
    }

    pre {
        overflow-x: auto;
        padding: 0.75rem 1rem;
        margin: 0 -1rem;

        ${GITHUB_HIGHLIGHT_THEME}
    }

    code {
        padding: 0.1em 0.5em;
    }

    @media screen and (min-width: 900px) {
        pre {
            margin: 0;
        }
    }
`;
