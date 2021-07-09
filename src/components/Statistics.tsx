import { getLanguageTitleFrom6392or3 } from "components/isoLang";
import React from "react";
import styled from "styled-components";

export const Statistics: React.FC<{ mapsInfo: any }> = function ({ mapsInfo }) {
    const data = Object.keys(mapsInfo.languages)
        .map((alpha3) => ({
            code: alpha3,
            languageTitle: getLanguageTitleFrom6392or3(alpha3) || "unknown",
            count: mapsInfo.languages[alpha3],
        }))
        .sort((a, b) => a.languageTitle.localeCompare(b.languageTitle));

    const list = data.map((lang) => (
        <CItem>
            <span>{lang.languageTitle}</span>
            <span>
                <strong>{lang.count}</strong>
            </span>
        </CItem>
    ));

    return <CList>{list}</CList>;
};

const CList = styled.ul`
max-height: 400px;
    display: flex;
    flex-flow: column;
    flex-wrap: wrap;
}
`;

const CItem = styled.li`
    width: 8rem;
    padding-top: 0.25rem;
    display: inline-flex;
    margin-right: 3rem;

    span:first-child {
        width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    span:nth-child(2) {
        width: 30%;
        text-align: right;
    }
`;
